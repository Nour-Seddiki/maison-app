import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export const revalidate = 0

async function updateListingStatus(id: string, status: string) {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.from('properties').update({ status }).eq('id', id)
  revalidatePath('/admin/listings')
}

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
        </div>

        <div className="bg-surface border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="label-caps text-text-muted text-left px-6 py-4">Property</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Seller</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Status</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Price</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Views</th>
                  <th className="label-caps text-text-muted text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!listings || listings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-muted font-body">No listings yet</td>
                  </tr>
                ) : listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-primary font-body">{listing.title}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{(listing.seller as any)?.full_name || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={listing.status === 'active' ? 'success' : listing.status === 'pending_review' ? 'gold' : 'outline'}>
                        {listing.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gold text-sm font-heading">£{listing.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{(listing.view_count || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {listing.status === 'pending_review' && (
                          <form action={updateListingStatus.bind(null, listing.id, 'active')}>
                            <Button type="submit" variant="gold" size="sm">Approve</Button>
                          </form>
                        )}
                        {listing.status === 'active' && (
                          <form action={updateListingStatus.bind(null, listing.id, 'off_market')}>
                            <Button type="submit" variant="dark" size="sm">Deactivate</Button>
                          </form>
                        )}
                        {listing.status !== 'pending_review' && listing.status !== 'active' && (
                          <form action={updateListingStatus.bind(null, listing.id, 'active')}>
                            <Button type="submit" variant="dark" size="sm">Activate</Button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
