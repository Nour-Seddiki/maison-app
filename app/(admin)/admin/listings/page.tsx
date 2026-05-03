import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminListingsClient from './AdminListingsClient'

export const revalidate = 0

export default async function AdminListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (adminProfile?.role !== 'admin') redirect('/dashboard')

  const { data: listings } = await supabase
    .from('properties')
    .select('id, title, price, status, view_count, created_at, seller:profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="label-caps text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl italic text-text-primary">All Listings</h1>
          <p className="text-sm text-text-muted font-body mt-2">{listings?.length || 0} total properties</p>
        </div>

        <div className="bg-surface border border-border">
          <AdminListingsClient listings={(listings || []) as any} />
        </div>
      </div>
    </div>
  )
}
