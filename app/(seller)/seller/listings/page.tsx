import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export const revalidate = 0

export default async function SellerListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: listings } = await supabase
    .from('properties')
    .select('id, title, status, price, view_count, cover_image_url, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  // Inquiry count per listing
  const { data: inquiryCounts } = await supabase
    .from('inquiries')
    .select('property_id')
    .eq('seller_id', user.id)

  const inquiryMap: Record<string, number> = {}
  for (const inq of inquiryCounts || []) {
    inquiryMap[inq.property_id] = (inquiryMap[inq.property_id] || 0) + 1
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="label-caps text-gold mb-2">Portfolio</p>
            <h1 className="font-heading text-4xl italic text-text-primary">Manage Listings</h1>
          </div>
          <Link href="/seller/listings/new">
            <Button variant="gold"><Plus size={14} className="mr-2" /> NEW LISTING</Button>
          </Link>
        </div>

        <div className="bg-surface border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="label-caps text-text-muted text-left px-6 py-4">Property</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Status</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Price</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Views</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Inquiries</th>
                </tr>
              </thead>
              <tbody>
                {!listings || listings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted font-body">
                      No listings yet.{' '}
                      <Link href="/seller/listings/new" className="text-gold hover:underline">Create your first listing</Link>
                    </td>
                  </tr>
                ) : listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 overflow-hidden flex-shrink-0">
                          {listing.cover_image_url ? (
                            <img src={listing.cover_image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-border" />
                          )}
                        </div>
                        <span className="text-sm text-text-primary font-body">{listing.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={listing.status === 'active' ? 'success' : listing.status === 'pending_review' ? 'gold' : 'outline'}>
                        {listing.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gold text-sm font-heading">£{listing.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{(listing.view_count || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{inquiryMap[listing.id] || 0}</td>
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
