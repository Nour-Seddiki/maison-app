import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditListingClient from './EditListingClient'

export const revalidate = 0

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: listing, error } = await supabase
    .from('properties')
    .select('id, title, property_type, bedrooms, bathrooms, sq_ft, full_address, city, price, narrative, editorial_accent_color, seller_id')
    .eq('id', id)
    .single()

  if (error || !listing) notFound()
  if (listing.seller_id !== user.id) redirect('/seller/listings')

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-10">
          <p className="label-caps text-gold mb-2">Edit Listing</p>
          <h1 className="font-heading text-4xl italic text-text-primary">{listing.title}</h1>
        </div>
        <EditListingClient listing={listing} />
      </div>
    </div>
  )
}
