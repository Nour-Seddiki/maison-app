import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PropertyDetailClient from './PropertyDetailClient'
import { Property } from '@/types'

export const revalidate = 0

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property, error } = await supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*), images:property_images(*), seller:profiles(id, full_name, display_name, avatar_url, company_name)')
    .eq('id', id)
    .single()

  if (error || !property) {
    notFound()
  }

  // Increment view count (best-effort, ignore all errors)
  try {
    await supabase.rpc('increment_view_count', { property_id: id })
  } catch {}

  // Fetch similar properties (same type, excluding current)
  const { data: similar } = await supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*)')
    .eq('status', 'active')
    .eq('property_type', property.property_type)
    .neq('id', id)
    .limit(3)

  return (
    <PropertyDetailClient
      property={property as any}
      similarProperties={(similar || []) as any}
    />
  )
}
