import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [usersResult, propertiesResult, inquiriesResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
  ])

  const pendingResult = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review')

  return NextResponse.json({
    data: {
      total_users: usersResult.count || 0,
      total_properties: propertiesResult.count || 0,
      total_inquiries: inquiriesResult.count || 0,
      pending_reviews: pendingResult.count || 0,
    }
  })
}
