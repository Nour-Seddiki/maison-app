import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*), images:property_images(*), seller:profiles(id, full_name, display_name, avatar_url, company_name)')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  // Increment view count (best-effort)
  try {
    await supabase.rpc('increment_view_count', { property_id: id })
  } catch {
    // silently ignore
  }

  return NextResponse.json({ data })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { data, error } = await supabase
    .from('properties')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the requester is the owner (or an admin) — use admin client to avoid RLS
  const adminDb = createAdminClient()
  const { data: profile } = await adminDb.from('profiles').select('role').eq('id', user.id).single()
  const { data: property } = await adminDb.from('properties').select('seller_id').eq('id', id).single()

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  const isOwner = property.seller_id === user.id
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await adminDb.from('properties').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
