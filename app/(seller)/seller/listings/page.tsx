import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import SellerListingsClient from './SellerListingsClient'

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

  const rows = (listings || []).map((l) => ({
    ...l,
    inquiryCount: inquiryMap[l.id] || 0,
  }))

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
          <SellerListingsClient listings={rows} />
        </div>
      </div>
    </div>
  )
}
