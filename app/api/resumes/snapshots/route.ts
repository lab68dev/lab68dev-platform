import { createRouteHandlerClient } from '@/lib/database/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request)
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeId, snapshotName, data } = await request.json()

    if (!resumeId || !data) {
        return NextResponse.json({ error: 'resumeId and data are required' }, { status: 400 })
    }

    // Insert new snapshot
    const { data: snapshot, error } = await supabase
      .from('resume_snapshots')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        snapshot_name: snapshotName || 'Auto-save',
        data: data
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating snapshot:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ snapshot })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient(request)
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const resumeId = searchParams.get('resumeId')

    if (!resumeId) {
        return NextResponse.json({ error: 'resumeId is required' }, { status: 400 })
    }

    const { data: snapshots, error } = await supabase
      .from('resume_snapshots')
      .select('id, snapshot_name, created_at')
      .eq('user_id', user.id)
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching snapshots:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ snapshots })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
