import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const revalidate = 0 // Opt out of static caching for dashboard

export default async function ClientDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/signin')
  }

  // Fetch saved properties
  const { data: savedData } = await supabase
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
    />
  )
}
