import { createRouteHandlerClient } from '@/lib/database/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const resumeId = searchParams.get('resumeId')

    if (!resumeId) {
        return NextResponse.json({ error: 'resumeId is required' }, { status: 400 })
    }

    // Fetch views for this resume
    const { data: views, error } = await supabase
      .from('portfolio_views')
      .select('id, device_type, referer, created_at')
      .eq('resume_id', resumeId)

    if (error) {
      console.error('Error fetching views:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate basic stats map (e.g. total views, views by device, views by referer)
    const stats = {
        total: views.length,
        devices: views.reduce((acc: any, v: any) => {
            acc[v.device_type] = (acc[v.device_type] || 0) + 1
            return acc
        }, {}),
        referers: views.reduce((acc: any, v: any) => {
            // Simplify referer (e.g. just domain)
            let ref = v.referer
            if (ref !== 'unknown' && ref.startsWith('http')) {
                try { ref = new URL(ref).hostname } catch(e) {}
            }
            acc[ref] = (acc[ref] || 0) + 1
            return acc
        }, {}),
        recent: views.slice(-100).reverse() // the latest 100
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
