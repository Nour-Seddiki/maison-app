'use client'

import PropertyCard from '@/components/property/PropertyCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { User, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { Property } from '@/types'
import Link from 'next/link'

interface DashboardClientProps {
  savedProperties: Property[]
  inquiries: any[]
}

export default function DashboardClient({ savedProperties, inquiries }: DashboardClientProps) {
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
          <Link href="/profile">
            <Button variant="ghost" size="sm">COMPLETE PROFILE</Button>
          </Link>
        </motion.div>

        {/* Saved Properties */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl text-text-primary mb-6">Saved Properties</h2>
          {savedProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.full_address}
                  price={property.price}
                  pricePerWeek={property.price_per_week ?? undefined}
                  listingType={property.listing_type}
                  bedrooms={property.bedrooms}
                  sqFt={property.sq_ft}
                  coverImage={property.cover_image_url || '/images/placeholder.png'}
                  isGradeListed={property.is_grade_listed}
                  gradeListing={property.grade_listing ?? undefined}
                  isSaved={true}
                  onSaveToggle={() => {}}
                />
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
          {inquiries.length > 0 ? (
            <div className="bg-surface border border-border">
              <div className="divide-y divide-border">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-2/50 transition-colors">
                    <div>
                      <p className="text-sm text-text-primary font-body">{inquiry.properties?.title || 'Unknown Property'}</p>
                      <p className="text-xs text-text-muted font-body tracking-wider mt-1">
                        Sent {new Date(inquiry.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge variant={inquiry.status === 'viewing_scheduled' ? 'success' : inquiry.status === 'new' ? 'gold' : 'outline'}>
                      {inquiry.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-border p-12 text-center">
              <p className="text-text-muted font-body tracking-wider">No inquiries made yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
