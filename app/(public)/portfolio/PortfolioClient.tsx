'use client'

import { useState, useCallback } from 'react'
import PropertyCard from '@/components/property/PropertyCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Property } from '@/types'

const PRICE_RANGES: Record<string, { min?: number; max?: number }> = {
  '1m-5m': { min: 1_000_000, max: 5_000_000 },
  '5m-10m': { min: 5_000_000, max: 10_000_000 },
  '10m-25m': { min: 10_000_000, max: 25_000_000 },
  '25m+': { min: 25_000_000 },
}

export default function PortfolioClient({ initialProperties }: { initialProperties: Property[] }) {
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: 'active' })
      if (propertyType) params.set('property_type', propertyType)
      if (priceRange && PRICE_RANGES[priceRange]) {
        const { min, max } = PRICE_RANGES[priceRange]
        if (min) params.set('min_price', String(min))
        if (max) params.set('max_price', String(max))
      }
      const res = await fetch(`/api/properties?${params.toString()}`)
      const json = await res.json()
      let results: Property[] = json.data || []
      // Client-side location filter (neighborhood name or city)
      if (location.trim()) {
        const q = location.trim().toLowerCase()
        results = results.filter(
          (p: Property) =>
            p.city?.toLowerCase().includes(q) ||
            (p as any).neighborhood?.name?.toLowerCase().includes(q) ||
            p.full_address?.toLowerCase().includes(q)
        )
      }
      setProperties(results)
    } catch {
      // Keep existing results on error
    } finally {
      setLoading(false)
    }
  }, [location, propertyType, priceRange])

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
          <Button variant="gold" size="md" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Refine Search'}
          </Button>
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-caps text-text-muted">Showing</p>
            <p className="text-text-primary font-heading text-xl mt-1">
              {properties.length} Available Estates
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
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <PropertyCard 
                id={property.id}
                title={property.title}
                location={property.neighborhood ? `${property.neighborhood.name}, ${property.city}` : property.city}
                price={property.price}
                pricePerWeek={property.price_per_week || undefined}
                listingType={property.listing_type}
                bedrooms={property.bedrooms}
                sqFt={property.sq_ft}
                coverImage={property.cover_image_url || '/images/hero.png'}
                neighborhoodBadge={property.neighborhood?.name}
                isGradeListed={property.is_grade_listed}
                gradeListing={property.grade_listing || undefined}
              />
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
