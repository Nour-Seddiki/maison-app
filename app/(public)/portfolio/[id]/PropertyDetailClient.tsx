'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import PropertyCard from '@/components/property/PropertyCard'
import { Heart, Share2, MapPin, Bed, Bath, Maximize, Building, ChevronLeft, ChevronRight } from 'lucide-react'
import { Property } from '@/types'

interface PropertyDetailClientProps {
  property: Property & {
    images?: { url: string; alt_text?: string | null }[]
    neighborhood?: { name: string; city: string } | null
    seller?: { id: string; full_name: string | null; company_name: string | null } | null
  }
  similarProperties: Property[]
}

export default function PropertyDetailClient({ property, similarProperties }: PropertyDetailClientProps) {
  const images: string[] =
    property.images && property.images.length > 0
      ? property.images.map((img) => img.url)
      : [property.cover_image_url || '/images/hero.png']

  const [currentImage, setCurrentImage] = useState(0)
  const [inquiryName, setInquiryName] = useState('')
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [inquiryDate, setInquiryDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property.id,
          seller_id: property.seller_id,
          contact_name: inquiryName,
          contact_email: inquiryEmail,
          contact_phone: inquiryPhone || undefined,
          message: inquiryMessage || undefined,
          preferred_viewing_date: inquiryDate || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  const location = property.neighborhood
    ? `${property.neighborhood.name}, ${property.city}`
    : property.city

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Gallery */}
      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <Image
          src={images[currentImage]}
          alt={property.title}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />

        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-obsidian/60 hover:bg-obsidian/80 p-3 text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-obsidian/60 hover:bg-obsidian/80 p-3 text-white transition-colors">
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
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
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div>
              {/* Title & Price */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="gold">{property.listing_type === 'sale' ? 'FOR SALE' : property.listing_type === 'rent' ? 'FOR RENT' : 'OFF MARKET'}</Badge>
                    {property.is_grade_listed && property.grade_listing && (
                      <Badge variant="outline">{property.grade_listing}</Badge>
                    )}
                  </div>
                  <h1 className="font-heading text-3xl md:text-5xl text-text-primary mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin size={14} />
                    <span className="text-sm font-body tracking-wider">{location}</span>
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

              <p className="text-gold font-heading text-4xl mb-10">£{property.price.toLocaleString()}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-surface border border-border mb-10">
                <div className="text-center">
                  <Bed size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary">{property.bedrooms ?? '—'}</p>
                  <p className="label-caps text-text-muted mt-1">Bedrooms</p>
                </div>
                <div className="text-center">
                  <Bath size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary">{property.bathrooms ?? '—'}</p>
                  <p className="label-caps text-text-muted mt-1">Bathrooms</p>
                </div>
                <div className="text-center">
                  <Maximize size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary">{property.sq_ft?.toLocaleString() ?? '—'}</p>
                  <p className="label-caps text-text-muted mt-1">Sq. Ft</p>
                </div>
                <div className="text-center">
                  <Building size={20} className="mx-auto text-gold mb-2" />
                  <p className="text-lg font-heading text-text-primary capitalize">{property.property_type}</p>
                  <p className="label-caps text-text-muted mt-1">Type</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <div className="p-4 border border-border">
                  <p className="label-caps text-text-muted mb-1">Tenure</p>
                  <p className="text-sm text-text-primary font-body">{property.is_freehold ? 'Freehold' : 'Leasehold'}</p>
                </div>
                {property.year_built && (
                  <div className="p-4 border border-border">
                    <p className="label-caps text-text-muted mb-1">Year Built</p>
                    <p className="text-sm text-text-primary font-body">{property.year_built}</p>
                  </div>
                )}
                {property.floors && (
                  <div className="p-4 border border-border">
                    <p className="label-caps text-text-muted mb-1">Floors</p>
                    <p className="text-sm text-text-primary font-body">{property.floors}</p>
                  </div>
                )}
              </div>

              {/* Narrative */}
              {(property.narrative || property.description) && (
                <div className="mb-10">
                  <h3 className="font-heading text-2xl text-text-primary mb-6">About This Residence</h3>
                  {(property.narrative || property.description || '').split('\n\n').map((paragraph: string, i: number) => (
                    <p key={i} className="text-sm text-text-secondary font-body font-light leading-relaxed tracking-wider mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-heading text-2xl text-text-primary mb-6">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {property.features.map((feature: string) => (
                      <span key={feature} className="px-4 py-2 border border-border text-xs font-body uppercase tracking-[0.15em] text-text-secondary hover:border-gold/30 hover:text-gold transition-colors">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-surface border border-border p-8">
                <h3 className="font-heading text-xl text-text-primary mb-2">Request Private Viewing</h3>
                <p className="text-xs text-text-muted font-body tracking-wider mb-6">
                  Our concierge team will arrange a discreet visit at your convenience.
                </p>

                {submitted ? (
                  <div className="text-center py-6">
                    <p className="text-gold font-heading text-lg mb-2">Request Received</p>
                    <p className="text-xs text-text-muted font-body tracking-wider">
                      We will be in touch shortly to confirm your viewing.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleInquiry}>
                    <Input
                      label="Full Name"
                      placeholder="Your name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      required
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
                        value={inquiryDate}
                        onChange={(e) => setInquiryDate(e.target.value)}
                        className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                      />
                    </div>
                    {error && <p className="text-xs text-red-400 font-body">{error}</p>}
                    <Button type="submit" variant="gold" fullWidth size="lg" disabled={submitting}>
                      {submitting ? 'SUBMITTING...' : 'REQUEST PRIVATE VIEWING'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="bg-charcoal py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <h3 className="font-heading text-3xl italic text-text-primary mb-10">Similar Properties</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  location={p.city}
                  price={p.price}
                  listingType={p.listing_type}
                  bedrooms={p.bedrooms}
                  sqFt={p.sq_ft}
                  coverImage={p.cover_image_url || '/images/hero.png'}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="py-8 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Link href="/portfolio" className="text-xs font-body uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
