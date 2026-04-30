'use client'

import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { BarChart3, Eye, MessageSquare, Clock, Plus, Edit, Archive } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Active Listings', value: '12', icon: BarChart3 },
  { label: 'Total Inquiries', value: '47', icon: MessageSquare },
  { label: 'Views This Month', value: '2,834', icon: Eye },
  { label: 'Pending Reviews', value: '3', icon: Clock },
]

const listings = [
  { id: '1', title: 'The Stanhope Residence', status: 'active', price: '£24,500,000', views: 1240, inquiries: 8, image: '/images/property-1.png' },
  { id: '2', title: 'One Southbank Tower', status: 'active', price: '£8,250,000', views: 890, inquiries: 5, image: '/images/property-2.png' },
  { id: '3', title: 'Cadogan Gardens', status: 'pending_review', price: '£12,000,000', views: 0, inquiries: 0, image: '/images/property-3.png' },
  { id: '4', title: 'Portland Place Penthouse', status: 'draft', price: '£18,750,000', views: 0, inquiries: 0, image: '/images/hero.png' },
]

const recentInquiries = [
  { clientName: 'Victoria Ashworth', property: 'The Stanhope Residence', date: '2 hours ago', status: 'new' },
  { clientName: 'Alexander Chen', property: 'One Southbank Tower', date: '1 day ago', status: 'contacted' },
  { clientName: 'Sophia Beaumont', property: 'The Stanhope Residence', date: '3 days ago', status: 'viewing_scheduled' },
]

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'pending_review': return 'gold'
    case 'draft': return 'outline'
    case 'new': return 'gold'
    case 'contacted': return 'outline'
    case 'viewing_scheduled': return 'success'
    default: return 'dark'
  }
}

const statusLabel = (status: string) => status.replace('_', ' ')

export default function SellerDashboard() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="label-caps text-gold mb-2">Seller Portal</p>
            <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary">Your Portfolio</h1>
          </div>
          <Link href="/seller/listings/new">
            <Button variant="gold"><Plus size={14} className="mr-2" /> NEW LISTING</Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-surface border border-border p-6"
            >
              <stat.icon size={20} className="text-gold mb-4" />
              <p className="font-heading text-3xl text-text-primary">{stat.value}</p>
              <p className="label-caps text-text-muted mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-surface border border-border mb-12">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-heading text-xl text-text-primary">Your Listings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="label-caps text-text-muted text-left px-6 py-3">Property</th>
                  <th className="label-caps text-text-muted text-left px-6 py-3">Status</th>
                  <th className="label-caps text-text-muted text-left px-6 py-3">Price</th>
                  <th className="label-caps text-text-muted text-left px-6 py-3">Views</th>
                  <th className="label-caps text-text-muted text-left px-6 py-3">Inquiries</th>
                  <th className="label-caps text-text-muted text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-2 overflow-hidden flex-shrink-0">
                          <img src={listing.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-text-primary font-body">{listing.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(listing.status) as 'gold' | 'success' | 'outline' | 'dark'}>{statusLabel(listing.status)}</Badge>
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

        {/* Recent Inquiries */}
        <div className="bg-surface border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-heading text-xl text-text-primary">Recent Inquiries</h3>
          </div>
          <div className="divide-y divide-border">
            {recentInquiries.map((inquiry, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-surface-2/50 transition-colors">
                <div>
                  <p className="text-sm text-text-primary font-body">{inquiry.clientName}</p>
                  <p className="text-xs text-text-muted font-body tracking-wider mt-1">{inquiry.property}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted font-body tracking-wider">{inquiry.date}</span>
                  <Badge variant={statusVariant(inquiry.status) as 'gold' | 'success' | 'outline' | 'dark'}>{statusLabel(inquiry.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
