import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, string> = {}
  let healthy = true

  // 1. App is running
  checks.app = 'ok'

  // 2. Check Supabase connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })
      checks.database = res.ok ? 'ok' : `error: ${res.status}`
      if (!res.ok) healthy = false
    } else {
      checks.database = 'missing env vars'
      healthy = false
    }
  } catch (e: any) {
    checks.database = `error: ${e.message}`
    healthy = false
  }

  // 3. Environment variables present
  checks.env_supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ok' : 'missing'
  checks.env_supabase_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ok' : 'missing'

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.1',
      checks,
    },
    { status: healthy ? 200 : 503 }
  )
}
