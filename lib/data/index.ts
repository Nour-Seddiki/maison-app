import { createClient } from '@/lib/supabase/server'

// ─── Properties ──────────────────────────────────────────────

export async function getProperties(filters?: {
  status?: string
  propertyType?: string
  listingType?: string
  minPrice?: number
  maxPrice?: number
  neighborhoodId?: string
  featured?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  const {
    status = 'active',
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    neighborhoodId,
    featured,
    limit = 20,
    offset = 0,
  } = filters || {}

  let query = supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*), images:property_images(*)', { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (propertyType) query = query.eq('property_type', propertyType)
  if (listingType) query = query.eq('listing_type', listingType)
  if (minPrice) query = query.gte('price', minPrice)
  if (maxPrice) query = query.lte('price', maxPrice)
  if (neighborhoodId) query = query.eq('neighborhood_id', neighborhoodId)
  if (featured) query = query.eq('is_featured', true)

  return query
}

export async function getFeaturedProperties(limit = 3) {
  const supabase = await createClient()
  return supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*), images:property_images(*)')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function getPropertyById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*), images:property_images(*), seller:profiles(id, full_name, display_name, avatar_url, company_name)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// ─── Neighborhoods ───────────────────────────────────────────

export async function getNeighborhoods() {
  const supabase = await createClient()
  return supabase
    .from('neighborhoods')
    .select('*')
    .order('name')
}

// ─── Inquiries ───────────────────────────────────────────────

export async function createInquiry(data: {
  property_id: string
  seller_id: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  message?: string
  preferred_viewing_date?: string
  client_id?: string
}) {
  const supabase = await createClient()
  return supabase
    .from('inquiries')
    .insert({ ...data, status: 'new' })
    .select()
    .single()
}

export async function getInquiriesForSeller(sellerId: string) {
  const supabase = await createClient()
  return supabase
    .from('inquiries')
    .select('*, property:properties(id, title, cover_image_url), client:profiles(id, full_name, email:full_name)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
}

export async function getInquiriesForClient(clientId: string) {
  const supabase = await createClient()
  return supabase
    .from('inquiries')
    .select('*, property:properties(id, title, cover_image_url)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
}

// ─── Saved Properties ────────────────────────────────────────

export async function getSavedProperties(userId: string) {
  const supabase = await createClient()
  return supabase
    .from('saved_properties')
    .select('*, property:properties(*, images:property_images(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function toggleSaveProperty(userId: string, propertyId: string) {
  const supabase = await createClient()

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single()

  if (existing) {
    return supabase.from('saved_properties').delete().eq('id', existing.id)
  }

  return supabase.from('saved_properties').insert({ user_id: userId, property_id: propertyId }).select().single()
}

// ─── Profiles ────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const supabase = await createClient()
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
}

// ─── Market Insights ─────────────────────────────────────────

export async function getPublishedInsights(limit = 10) {
  const supabase = await createClient()
  return supabase
    .from('market_insights')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)
}

export async function getInsightBySlug(slug: string) {
  const supabase = await createClient()
  return supabase
    .from('market_insights')
    .select('*, author:profiles(full_name, avatar_url)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
}

// ─── Admin ───────────────────────────────────────────────────

export async function getAdminStats() {
  const supabase = await createClient()

  const [users, properties, inquiries, pending] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
  ])

  return {
    totalUsers: users.count || 0,
    totalProperties: properties.count || 0,
    totalInquiries: inquiries.count || 0,
    pendingReviews: pending.count || 0,
  }
}

export async function getAllUsers() {
  const supabase = await createClient()
  return supabase.from('profiles').select('*').order('created_at', { ascending: false })
}

export async function getAllListings() {
  const supabase = await createClient()
  return supabase
    .from('properties')
    .select('*, seller:profiles(full_name)')
    .order('created_at', { ascending: false })
}

// ─── Seller ──────────────────────────────────────────────────

export async function getSellerListings(sellerId: string) {
  const supabase = await createClient()
  return supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
}

export async function getSellerStats(sellerId: string) {
  const supabase = await createClient()

  const [listings, inquiries] = await Promise.all([
    supabase.from('properties').select('id, status, view_count').eq('seller_id', sellerId),
    supabase.from('inquiries').select('id, status').eq('seller_id', sellerId),
  ])

  const active = listings.data?.filter(l => l.status === 'active').length || 0
  const totalViews = listings.data?.reduce((sum, l) => sum + (l.view_count || 0), 0) || 0
  const totalInquiries = inquiries.data?.length || 0
  const pendingReviews = listings.data?.filter(l => l.status === 'pending_review').length || 0

  return { active, totalViews, totalInquiries, pendingReviews }
}

// ─── Auth Helpers ────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile ? { ...user, profile } : null
}
