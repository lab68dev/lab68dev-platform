import { createRouteHandlerClient } from '@/lib/database/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request)
    const { resumeId } = await request.json()

    if (!resumeId) {
        return NextResponse.json({ error: 'resumeId is required' }, { status: 400 })
    }

    // Extract basic headers for analytics
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'unknown'

    // Determine basic device type
    let device_type = 'desktop'
    if (/Mobi|Android/i.test(user_agent)) device_type = 'mobile'
    if (/Tablet|iPad/i.test(user_agent)) device_type = 'tablet'

    // Insert new view
    const { error } = await supabase
      .from('portfolio_views')
      .insert({
        resume_id: resumeId,
        ip_address,
        user_agent,
        referer,
        device_type,
        // Optional country/city parsing can be added with GeoIP or Vercel headers later
      })

    if (error) {
      console.error('Error recording view:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
