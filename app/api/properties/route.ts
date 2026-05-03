import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const status = searchParams.get('status') || 'active'
  const propertyType = searchParams.get('property_type')
  const listingType = searchParams.get('listing_type')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const neighborhood = searchParams.get('neighborhood_id')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*), images:property_images(*)', { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (propertyType) query = query.eq('property_type', propertyType)
  if (listingType) query = query.eq('listing_type', listingType)
  if (minPrice) query = query.gte('price', parseInt(minPrice))
  if (maxPrice) query = query.lte('price', parseInt(maxPrice))
  if (neighborhood) query = query.eq('neighborhood_id', neighborhood)
  if (featured === 'true') query = query.eq('is_featured', true)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'seller' && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Only sellers can create listings' }, { status: 403 })
  }

  const body = await request.json()

  // Auto-generate slug from title
  const baseSlug = (body.title || 'property')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const slug = `${baseSlug}-${Date.now()}`

  const { data, error } = await supabase
    .from('properties')
    .insert({
      ...body,
      slug,
      seller_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Notify the seller that their listing is now live
  try {
    const admin = createAdminClient()
    await admin.from('notifications').insert({
      user_id: user.id,
      type: 'new_listing',
      title: 'Property Published',
      message: `Your listing "${data.title}" is now live on Maison & Co.`,
      link: `/portfolio/${data.id}`,
    })
  } catch {}

  return NextResponse.json({ data }, { status: 201 })
}
