'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import PropertyCard from '@/components/property/PropertyCard'
import { Heart, Share2, MapPin, Bed, Bath, Maximize, Building, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const propertyData = {
  id: '1',
  title: 'The Stanhope Residence',
  location: 'W1 Mayfair, London',
  price: 24500000,
  listingType: 'sale' as const,
  status: 'active',
  bedrooms: 7,
  bathrooms: 5.5,
  sqFt: 6200,
  propertyType: 'Townhouse',
  isFreehold: true,
  isGradeListed: true,
  gradeListing: 'Grade II Listed',
  yearBuilt: 1842,
  floors: 4,
  features: ['Private Garden', 'Wine Cellar', 'Staff Quarters', 'Roof Terrace', 'Mews House', 'Concierge Service', 'Lift', 'Original Fireplaces'],
  narrative: `Standing sentinel on one of Mayfair's most coveted crescents, The Stanhope Residence is a masterwork of Georgian architecture that has witnessed nearly two centuries of London's most distinguished history.

Behind its immaculately preserved Portland stone facade lies a home that seamlessly marries period grandeur with contemporary living. The principal reception rooms retain their original cornicing, marble fireplaces, and floor-to-ceiling sash windows that flood the interiors with natural light.

The lower ground floor houses a state-of-the-art kitchen designed by a renowned Italian atelier, opening onto a private walled garden—a rare sanctuary in the heart of the capital. Above, the master suite occupies the entire first floor, with dual dressing rooms and a bathroom crafted from Calacatta marble.

This is not merely a residence; it is a position in the architecture of London's most distinguished address book.`,
  images: [
    '/images/property-1.png',
    '/images/hero.png',
    '/images/library.png',
    '/images/property-2.png',
    '/images/property-3.png',
  ],
}

const similarProperties = [
  {
    id: '2', title: 'One Southbank Tower', location: 'SE1 Southbank, London',
    price: 8250000, listingType: 'sale' as const, bedrooms: 3, sqFt: 2800,
    coverImage: '/images/property-2.png', neighborhoodBadge: 'Southbank',
  },
  {
    id: '3', title: 'Belgravia Manor', location: 'SW1 Belgravia, London',
    price: 12000000, listingType: 'sale' as const, bedrooms: 5, sqFt: 4100,
    coverImage: '/images/property-3.png', neighborhoodBadge: 'Belgravia',
  },
  {
    id: '4', title: 'The Hans Mews', location: 'SW3 Knightsbridge, London',
    price: 4950000, listingType: 'sale' as const, bedrooms: 2, sqFt: 1800,
    coverImage: '/images/hero.png', neighborhoodBadge: 'Knightsbridge',
  },
]

export default function PropertyDetailPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const [inquiryName, setInquiryName] = useState('')
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [inquiryMessage, setInquiryMessage] = useState('')

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % propertyData.images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length)

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Gallery */}
      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <Image
          src={propertyData.images[currentImage]}
          alt={propertyData.title}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Navigation Arrows */}
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-obsidian/60 hover:bg-obsidian/80 p-3 text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-obsidian/60 hover:bg-obsidian/80 p-3 text-white transition-colors">
          <ChevronRight size={20} />
        </button>

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {propertyData.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`relative w-16 h-12 border-2 transition-colors overflow-hidden ${
                i === currentImage ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Title & Price */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="gold">FOR SALE</Badge>
                    {propertyData.isGradeListed && (
                      <Badge variant="outline">{propertyData.gradeListing}</Badge>
                    )}
                  </div>
                  <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-2">
                    {propertyData.title}
                  </h1>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin size={14} />
                    <span className="text-sm font-body tracking-wider">{propertyData.location}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="p-3 border border-border hover:border-gold/30 text-text-muted hover:text-gold transition-all">
                    <Heart size={18} />
                  </button>
                  <button className="p-3 border border-border hover:border-gold/30 text-text-muted hover:text-gold transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-gold font-heading text-4xl mb-10">
                £{propertyData.price.toLocaleString()}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-surface border border-border mb-10">
                <div className="text-center">
                  <Bed size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary">{propertyData.bedrooms}</p>
                  <p className="label-caps text-text-muted mt-1">Bedrooms</p>
                </div>
                <div className="text-center">
                  <Bath size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary">{propertyData.bathrooms}</p>
                  <p className="label-caps text-text-muted mt-1">Bathrooms</p>
                </div>
                <div className="text-center">
                  <Maximize size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary">{propertyData.sqFt.toLocaleString()}</p>
                  <p className="label-caps text-text-muted mt-1">Sq. Ft</p>
                </div>
                <div className="text-center">
                  <Building size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary">{propertyData.propertyType}</p>
                  <p className="label-caps text-text-muted mt-1">Type</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <div className="p-4 border border-border">
                  <p className="label-caps text-text-muted mb-1">Tenure</p>
                  <p className="text-sm text-text-primary font-body">{propertyData.isFreehold ? 'Freehold' : 'Leasehold'}</p>
                </div>
                <div className="p-4 border border-border">
                  <p className="label-caps text-text-muted mb-1">Year Built</p>
                  <p className="text-sm text-text-primary font-body">{propertyData.yearBuilt}</p>
                </div>
                <div className="p-4 border border-border">
                  <p className="label-caps text-text-muted mb-1">Floors</p>
                  <p className="text-sm text-text-primary font-body">{propertyData.floors}</p>
                </div>
              </div>

              {/* Narrative */}
              <div className="mb-10">
                <h3 className="font-heading text-2xl text-text-primary mb-6">About This Residence</h3>
                {propertyData.narrative.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-sm text-text-secondary font-body font-light leading-relaxed tracking-wider mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Features */}
              <div className="mb-10">
                <h3 className="font-heading text-2xl text-text-primary mb-6">Features & Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {propertyData.features.map((feature) => (
                    <span key={feature} className="px-4 py-2 border border-border text-xs font-body uppercase tracking-[0.15em] text-text-secondary hover:border-gold/30 hover:text-gold transition-colors">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-28"
            >
              <div className="bg-surface border border-border p-8">
                <h3 className="font-heading text-xl text-text-primary mb-2">Request Private Viewing</h3>
                <p className="text-xs text-text-muted font-body tracking-wider mb-6">
                  Our concierge team will arrange a discreet visit at your convenience.
                </p>

                <form className="space-y-5">
                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+44 (0) 7XXX XXXXXX"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                  />
                  <div>
                    <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your search..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
                      Preferred Viewing Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                    />
                  </div>
                  <Button type="button" variant="gold" fullWidth size="lg">
                    REQUEST PRIVATE VIEWING
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div className="bg-charcoal py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <h3 className="font-heading text-3xl italic text-text-primary mb-10">Similar Properties</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {similarProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
