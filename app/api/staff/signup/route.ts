import { NextRequest, NextResponse } from 'next/server'
import { 
  hashPassword, 
  createStaffInDatabase,
  checkRateLimit,
  supabase 
} from '@/lib/staff-security'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, confirmPassword, department, employeeId, phone } = body

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`signup_${clientIp}`, 3, 60 * 60 * 1000) // 3 attempts per hour
    
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60)
      return NextResponse.json(
        { error: `Too many signup attempts. Please try again in ${resetIn} minutes.` },
        { status: 429 }
      )
    }

    // Validation
    if (!name || !email || !password || !confirmPassword || !department || !employeeId) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Email validation
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create staff in database
    if (supabase) {
      // Use Supabase
      const staff = await createStaffInDatabase({
        email,
        name,
        role: 'support', // Default role
        department,
        employeeId,
        phone,
        passwordHash,
      })

      // Create approval request
      const { error: approvalError } = await supabase
        .from('staff_approval_requests')
        .insert({
          staff_id: staff.id,
          status: 'pending',
        })

      if (approvalError) throw approvalError

      return NextResponse.json({
        message: 'Registration successful! Your account is pending admin approval.',
        staffId: staff.id,
      })
    } else {
      // Fallback to localStorage (handled on client)
      return NextResponse.json({
        message: 'Registration successful! Your account is pending admin approval.',
        fallback: true,
        staffData: {
          email,
          name,
          role: 'support',
          department,
          employeeId,
          phone,
          passwordHash,
        },
      })
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Email or Employee ID already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
