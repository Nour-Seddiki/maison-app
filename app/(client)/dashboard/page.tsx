import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const revalidate = 0 // Opt out of static caching for dashboard

export default async function ClientDashboard({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; propertyId?: string }>
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/signin')
  }

  const params = await searchParams
  const paymentSuccess = params.payment === 'success'
  const paidPropertyId = params.propertyId

  // Handle successful Stripe payment: save the property and notify the user
  if (paymentSuccess && paidPropertyId) {
    const adminDb = createAdminClient()

    // Auto-save the property if not already saved
    const { data: existing } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', paidPropertyId)
      .maybeSingle()

    if (!existing) {
      await supabase
        .from('saved_properties')
        .insert({ user_id: user.id, property_id: paidPropertyId })
    }

    // Get property title and listing type for the notification
    const { data: prop } = await adminDb
      .from('properties')
      .select('title, listing_type')
      .eq('id', paidPropertyId)
      .maybeSingle()

    // Mark property as sold or rented
    const newStatus = prop?.listing_type === 'rent' ? 'rented' : 'sold'
    await adminDb
      .from('properties')
      .update({ status: newStatus })
      .eq('id', paidPropertyId)

    // Create notification
    await adminDb.from('notifications').insert({
      user_id: user.id,
      title: 'Payment Confirmed',
      message: prop?.title
        ? `Your payment for "${prop.title}" was successful. It has been added to your saved properties.`
        : 'Your payment was confirmed. The property has been added to your dashboard.',
      link: `/portfolio/${paidPropertyId}`,
      is_read: false,
    })
  }

  // Fetch saved properties via admin client so sold/rented properties still show
  const adminDb = createAdminClient()
  const { data: savedData } = await adminDb
    .from('saved_properties')
    .select('*, properties(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const savedProperties = savedData?.map(s => s.properties).filter(Boolean) || []

  // Fetch inquiries
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*, properties(title)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardClient 
      savedProperties={savedProperties as any} 
      inquiries={inquiries || []} 
      paymentSuccess={paymentSuccess}
      paidPropertyId={paidPropertyId}
    />
  )
}
