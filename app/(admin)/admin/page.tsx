'use client'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Users, Building, MessageSquare, TrendingUp, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Total Users', value: '1,247', icon: Users, trend: '+12%' },
  { label: 'Active Listings', value: '89', icon: Building, trend: '+5%' },
  { label: 'Pending Reviews', value: '7', icon: MessageSquare, trend: '' },
  { label: 'Monthly Revenue', value: '£2.4M', icon: TrendingUp, trend: '+18%' },
]

const pendingListings = [
  { id: '1', title: 'Cadogan Gardens', seller: 'James Morrison', price: '£12,000,000', submitted: '2 hours ago' },
  { id: '2', title: 'Lansdowne House', seller: 'Elizabeth Hayes', price: '£8,750,000', submitted: '5 hours ago' },
  { id: '3', title: 'Chester Square Flat', seller: 'Robert Chen', price: '£3,200,000', submitted: '1 day ago' },
]

const recentUsers = [
  { name: 'Victoria Ashworth', email: 'v.ashworth@email.com', role: 'client', joined: 'Apr 28, 2024' },
  { name: 'James Morrison', email: 'j.morrison@agency.com', role: 'seller', joined: 'Apr 27, 2024' },
  { name: 'Sophia Beaumont', email: 's.beaumont@email.com', role: 'client', joined: 'Apr 26, 2024' },
  { name: 'Alexander Chen', email: 'a.chen@estate.com', role: 'seller', joined: 'Apr 25, 2024' },
]

const recentInquiries = [
  { client: 'Victoria Ashworth', property: 'The Stanhope Residence', seller: 'James Morrison', date: '2 hours ago' },
  { client: 'Alexander Chen', property: 'One Southbank Tower', seller: 'Elizabeth Hayes', date: '1 day ago' },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="label-caps text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary">Platform Overview</h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={20} className="text-gold" />
                {stat.trend && <span className="text-xs text-success font-body">{stat.trend}</span>}
              </div>
              <p className="font-heading text-3xl text-text-primary">{stat.value}</p>
              <p className="label-caps text-text-muted mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Pending Reviews */}
          <div className="bg-surface border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-heading text-xl text-text-primary">Pending Reviews</h3>
              <Badge variant="gold">{pendingListings.length}</Badge>
            </div>
            <div className="divide-y divide-border">
              {pendingListings.map((listing) => (
                <div key={listing.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-text-primary font-body">{listing.title}</p>
                      <p className="text-xs text-text-muted font-body tracking-wider">{listing.seller} · {listing.submitted}</p>
                    </div>
                    <p className="text-gold text-sm font-heading">{listing.price}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="gold" size="sm"><Check size={12} className="mr-1" /> Approve</Button>
                    <Button variant="dark" size="sm"><X size={12} className="mr-1" /> Reject</Button>
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
              {recentUsers.map((user, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary font-body">{user.name}</p>
                    <p className="text-xs text-text-muted font-body tracking-wider">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === 'seller' ? 'gold' : 'outline'}>{user.role}</Badge>
                    <span className="text-xs text-text-muted font-body">{user.joined}</span>
                  </div>
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
            {recentInquiries.map((inquiry, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary font-body">{inquiry.client} → {inquiry.property}</p>
                  <p className="text-xs text-text-muted font-body tracking-wider">Seller: {inquiry.seller}</p>
                </div>
                <span className="text-xs text-text-muted font-body">{inquiry.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
