'use client'

import PropertyCard from '@/components/property/PropertyCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { User, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

const savedProperties = [
  { id: '1', title: 'The Stanhope Residence', location: 'W1 Mayfair, London', price: 24500000, listingType: 'sale' as const, bedrooms: 7, sqFt: 6200, coverImage: '/images/property-1.png', isSaved: true },
  { id: '2', title: 'One Southbank Tower', location: 'SE1 Southbank, London', price: 8250000, listingType: 'sale' as const, bedrooms: 3, sqFt: 2800, coverImage: '/images/property-2.png', isSaved: true },
]

const inquiries = [
  { property: 'The Stanhope Residence', date: 'April 28, 2024', status: 'viewing_scheduled' },
  { property: 'One Southbank Tower', date: 'April 25, 2024', status: 'contacted' },
  { property: 'Belgrave Square', date: 'April 20, 2024', status: 'new' },
]

export default function ClientDashboard() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="label-caps text-gold mb-2">Welcome Back</p>
          <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary">Your Dashboard</h1>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-gold/20 p-6 mb-12 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-surface-2 border border-border flex items-center justify-center">
              <User size={20} className="text-gold" />
            </div>
            <div>
              <p className="text-sm text-text-primary font-body">Complete your profile</p>
              <p className="text-xs text-text-muted font-body tracking-wider">Add your preferences to receive personalized recommendations</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">COMPLETE PROFILE</Button>
        </motion.div>

        {/* Saved Properties */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl text-text-primary mb-6">Saved Properties</h2>
          {savedProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} onSaveToggle={() => {}} />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-border p-12 text-center">
              <p className="text-text-muted font-body tracking-wider">No saved properties yet</p>
            </div>
          )}
        </div>

        {/* Inquiries */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl text-text-primary mb-6">My Inquiries</h2>
          <div className="bg-surface border border-border">
            <div className="divide-y divide-border">
              {inquiries.map((inquiry, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-surface-2/50 transition-colors">
                  <div>
                    <p className="text-sm text-text-primary font-body">{inquiry.property}</p>
                    <p className="text-xs text-text-muted font-body tracking-wider mt-1">Sent {inquiry.date}</p>
                  </div>
                  <Badge variant={inquiry.status === 'viewing_scheduled' ? 'success' : inquiry.status === 'new' ? 'gold' : 'outline'}>
                    {inquiry.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
