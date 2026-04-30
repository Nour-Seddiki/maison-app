'use client'

import { useState } from 'react'
import PropertyCard from '@/components/property/PropertyCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { motion } from 'framer-motion'

const mockProperties = [
  {
    id: '1', title: 'The Stanhope Residence', location: 'W1 Mayfair, London',
    price: 24500000, listingType: 'sale' as const, bedrooms: 7, sqFt: 6200,
    coverImage: '/images/property-1.png', neighborhoodBadge: 'Mayfair',
    isGradeListed: true, gradeListing: 'Grade II Listed',
  },
  {
    id: '2', title: 'Observation Point', location: 'SE1 Southbank, London',
    price: 8250000, listingType: 'sale' as const, bedrooms: 3, sqFt: 2800,
    coverImage: '/images/property-2.png', neighborhoodBadge: 'Southbank',
  },
  {
    id: '3', title: 'Belgrave Square', location: 'SW1 Belgravia, London',
    price: 15000, pricePerWeek: 15000, listingType: 'rent' as const, bedrooms: 5, sqFt: 4100,
    coverImage: '/images/property-3.png', neighborhoodBadge: 'Belgravia',
  },
  {
    id: '4', title: 'The Hans Mews', location: 'SW3 Knightsbridge, London',
    price: 4950000, listingType: 'sale' as const, bedrooms: 2, sqFt: 1800,
    coverImage: '/images/hero.png', neighborhoodBadge: 'Knightsbridge',
  },
  {
    id: '5', title: 'Cadogan Gardens', location: 'SW3 Chelsea, London',
    price: 12000000, listingType: 'sale' as const, bedrooms: 4, sqFt: 3600,
    coverImage: '/images/library.png', neighborhoodBadge: 'Chelsea',
  },
  {
    id: '6', title: 'Portland Place Penthouse', location: 'W1 Marylebone, London',
    price: 18750000, listingType: 'sale' as const, bedrooms: 5, sqFt: 5100,
    coverImage: '/images/property-1.png', neighborhoodBadge: 'Marylebone',
    isGradeListed: true, gradeListing: 'Grade I Listed',
  },
]

export default function PortfolioPage() {
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')

  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="label-caps text-gold mb-3">Portfolio</p>
          <h1 className="font-heading text-4xl md:text-6xl italic text-text-primary mb-4">
            Curated Residences
          </h1>
          <p className="text-text-secondary font-body font-light text-sm tracking-wider max-w-xl mx-auto">
            Defining the architecture of exceptional living in London&apos;s most historic postcodes.
          </p>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12">
        <div className="bg-surface border border-border p-6 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <Input
              label="Location"
              placeholder="Mayfair, Chelsea, Belgravia..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold transition-all appearance-none"
            >
              <option value="">All Types</option>
              <option value="penthouse">Penthouse</option>
              <option value="townhouse">Townhouse</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="estate">Estate</option>
              <option value="mews">Mews</option>
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
              Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold transition-all appearance-none"
            >
              <option value="">Any Price</option>
              <option value="1m-5m">£1M — £5M</option>
              <option value="5m-10m">£5M — £10M</option>
              <option value="10m-25m">£10M — £25M</option>
              <option value="25m+">£25M+</option>
            </select>
          </div>
          <Button variant="gold" size="md">Refine Search</Button>
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-caps text-text-muted">Showing</p>
            <p className="text-text-primary font-heading text-xl mt-1">
              {mockProperties.length} Available Estates
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-body uppercase tracking-[0.15em] text-text-muted hover:text-gold transition-colors">
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 text-xs font-body uppercase tracking-[0.15em] text-text-muted hover:text-gold transition-colors">
              <ArrowUpDown size={14} /> Sort by: Price High
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <PropertyCard {...property} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-8 bg-surface border border-border">
          {/* Newsletter */}
          <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-border">
            <h3 className="font-heading text-3xl italic text-text-primary mb-3">
              Privileged Access
            </h3>
            <p className="text-xs text-text-muted font-body tracking-wider leading-relaxed mb-6">
              Subscribe to our Private Journal for early access to off-market listings and
              curated architectural insights from the heart of London.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-1 bg-transparent border-b border-border px-0 py-2 text-xs text-text-primary font-body tracking-wider placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
              />
              <button className="text-gold hover:text-gold-light transition-colors">→</button>
            </div>
          </div>

          {/* Contact */}
          <div className="p-8 md:p-12">
            <p className="label-caps text-gold mb-4">Contact Concierge</p>
            <h3 className="font-heading text-2xl italic text-text-primary mb-6">
              Discretion is our hallmark. Let us find your legacy.
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-text-secondary font-body tracking-wider">
                +44 (0) 20 7123 4567
              </p>
              <p className="text-sm text-text-secondary font-body tracking-wider">
                concierge@maison.co.uk
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
