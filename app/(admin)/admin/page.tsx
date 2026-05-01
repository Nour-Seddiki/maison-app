import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Users, Building, MessageSquare, TrendingUp, Check, X } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export const revalidate = 0

async function approveProperty(id: string) {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.from('properties').update({ status: 'active' }).eq('id', id)
  revalidatePath('/admin')
}

async function rejectProperty(id: string) {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.from('properties').update({ status: 'off_market' }).eq('id', id)
  revalidatePath('/admin')
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (adminProfile?.role !== 'admin') redirect('/dashboard')

  const [usersResult, propertiesResult, inquiriesResult, pendingResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
  ])

  const stats = [
    { label: 'Total Users', value: (usersResult.count || 0).toLocaleString(), icon: Users },
    { label: 'Active Listings', value: (propertiesResult.count || 0).toLocaleString(), icon: Building },
    { label: 'Pending Reviews', value: (pendingResult.count || 0).toLocaleString(), icon: MessageSquare },
    { label: 'Total Inquiries', value: (inquiriesResult.count || 0).toLocaleString(), icon: TrendingUp },
  ]

  const { data: pendingListings } = await supabase
    .from('properties')
    .select('id, title, price, created_at, seller:profiles(full_name)')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('full_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('contact_name, status, created_at, property:properties(title)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="label-caps text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary">Platform Overview</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={20} className="text-gold" />
              </div>
              <p className="font-heading text-3xl text-text-primary">{stat.value}</p>
              <p className="label-caps text-text-muted mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Pending Reviews */}
          <div className="bg-surface border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-heading text-xl text-text-primary">Pending Reviews</h3>
              <Badge variant="gold">{pendingListings?.length || 0}</Badge>
            </div>
            <div className="divide-y divide-border">
              {!pendingListings || pendingListings.length === 0 ? (
                <div className="px-6 py-8 text-center text-text-muted font-body text-sm">No pending reviews</div>
              ) : pendingListings.map((listing) => (
                <div key={listing.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-text-primary font-body">{listing.title}</p>
                      <p className="text-xs text-text-muted font-body tracking-wider">
                        {(listing.seller as any)?.full_name} · {new Date(listing.created_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <p className="text-gold text-sm font-heading">£{listing.price?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <form action={approveProperty.bind(null, listing.id)}>
                      <Button type="submit" variant="gold" size="sm"><Check size={12} className="mr-1" /> Approve</Button>
                    </form>
                    <form action={rejectProperty.bind(null, listing.id)}>
                      <Button type="submit" variant="dark" size="sm"><X size={12} className="mr-1" /> Reject</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-surface border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-xl text-text-primary">Recent Users</h3>
            </div>
            <div className="divide-y divide-border">
              {!recentUsers || recentUsers.length === 0 ? (
                <div className="px-6 py-8 text-center text-text-muted font-body text-sm">No users yet</div>
              ) : recentUsers.map((u, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary font-body">{u.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-text-muted font-body tracking-wider">{new Date(u.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
                  <Badge variant={u.role === 'seller' ? 'gold' : u.role === 'admin' ? 'error' : 'outline'}>{u.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-surface border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-heading text-xl text-text-primary">Recent Inquiries</h3>
          </div>
          <div className="divide-y divide-border">
            {!recentInquiries || recentInquiries.length === 0 ? (
              <div className="px-6 py-8 text-center text-text-muted font-body text-sm">No inquiries yet</div>
            ) : recentInquiries.map((inq, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary font-body">
                    {inq.contact_name} → {(inq.property as any)?.title || 'Unknown Property'}
                  </p>
                  <p className="text-xs text-text-muted font-body tracking-wider">
                    {new Date(inq.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <Badge variant={inq.status === 'new' ? 'gold' : inq.status === 'viewing_scheduled' ? 'success' : 'outline'}>
                  {inq.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
