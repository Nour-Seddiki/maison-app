'use client'

import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { BarChart3, Eye, MessageSquare, Clock, Plus, Edit, Archive } from 'lucide-react'
import { motion } from 'framer-motion'

const listings = [
  { id: '1', title: 'The Stanhope Residence', status: 'active', price: '£24,500,000', views: 1240, inquiries: 8, image: '/images/property-1.png' },
  { id: '2', title: 'One Southbank Tower', status: 'active', price: '£8,250,000', views: 890, inquiries: 5, image: '/images/property-2.png' },
  { id: '3', title: 'Cadogan Gardens', status: 'pending_review', price: '£12,000,000', views: 0, inquiries: 0, image: '/images/property-3.png' },
]

export default function SellerListingsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="label-caps text-gold mb-2">Portfolio</p>
            <h1 className="font-heading text-4xl italic text-text-primary">Manage Listings</h1>
          </div>
          <Link href="/seller/listings/new">
            <Button variant="gold"><Plus size={14} className="mr-2" /> NEW LISTING</Button>
          </Link>
        </motion.div>

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
                  <th className="label-caps text-text-muted text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 overflow-hidden flex-shrink-0">
                          <img src={listing.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-text-primary font-body">{listing.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={listing.status === 'active' ? 'success' : 'gold'}>{listing.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gold text-sm font-heading">{listing.price}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{listing.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{listing.inquiries}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-text-muted hover:text-gold transition-colors"><Edit size={14} /></button>
                        <button className="p-2 text-text-muted hover:text-gold transition-colors"><Archive size={14} /></button>
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
