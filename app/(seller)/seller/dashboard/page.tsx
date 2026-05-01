import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const revalidate = 0

export default async function SellerDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/signin')
  }

  // Fetch properties (listings) for the seller
  const { data: listings } = await supabase
    .from('properties')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch inquiries for the seller's properties
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*, properties(title)')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  // Calculate stats
  const activeListings = listings?.filter(l => l.status === 'active').length || 0
  const pendingReviews = listings?.filter(l => l.status === 'pending_review').length || 0
  const totalInquiries = inquiries?.length || 0
  const totalViews = listings?.reduce((sum, l) => sum + (l.view_count || 0), 0) || 0

  const stats = [
    { label: 'Active Listings', value: activeListings.toString() },
    { label: 'Total Inquiries', value: totalInquiries.toString() },
    { label: 'Views This Month', value: totalViews.toLocaleString() },
    { label: 'Pending Reviews', value: pendingReviews.toString() },
  ]

  return (
    <DashboardClient 
      stats={stats} 
      listings={listings || []} 
      recentInquiries={(inquiries || []).slice(0, 5)} 
    />
  )
}
