import { NextRequest, NextResponse } from 'next/server'

// TODO: Replace with your actual database client
// import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user from session/JWT
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // 1. Fetch user from database
    // TODO: Replace with your database query
    // const user = await db.users.findUnique({
    //   where: { id: userId },
    //   select: { mfaEnabled: true }
    // })

    const user = {
      mfaEnabled: false,
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      enabled: user.mfaEnabled,
    })
  } catch (error) {
    console.error('Get MFA status error:', error)
    return NextResponse.json(
      { error: 'Failed to get MFA status' },
      { status: 500 }
    )
  }
}
