'use client'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'

const listings = [
  { id: '1', title: 'The Stanhope Residence', seller: 'James Morrison', status: 'active', price: '£24,500,000', views: 1240 },
  { id: '2', title: 'One Southbank Tower', seller: 'Elizabeth Hayes', status: 'active', price: '£8,250,000', views: 890 },
  { id: '3', title: 'Cadogan Gardens', seller: 'James Morrison', status: 'pending_review', price: '£12,000,000', views: 0 },
  { id: '4', title: 'Lansdowne House', seller: 'Elizabeth Hayes', status: 'pending_review', price: '£8,750,000', views: 0 },
  { id: '5', title: 'Chester Square Flat', seller: 'Robert Chen', status: 'draft', price: '£3,200,000', views: 0 },
]

export default function AdminListingsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="label-caps text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl italic text-text-primary">All Listings</h1>
        </motion.div>

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
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-primary font-body">{listing.title}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{listing.seller}</td>
                    <td className="px-6 py-4">
                      <Badge variant={listing.status === 'active' ? 'success' : listing.status === 'pending_review' ? 'gold' : 'outline'}>
                        {listing.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gold text-sm font-heading">{listing.price}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{listing.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="dark" size="sm">Manage</Button>
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
