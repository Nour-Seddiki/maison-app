'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import PropertyCard from '@/components/property/PropertyCard'
import { Heart, Share2, MapPin, Bed, Bath, Maximize, Building, ChevronLeft, ChevronRight, CreditCard, Landmark, Bitcoin, ShieldCheck, Lock } from 'lucide-react'
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

  const searchParams = useSearchParams()
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'card' | 'crypto' | null>(null)
  const [paymentStep, setPaymentStep] = useState<'choose' | 'confirm' | 'done'>('choose')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isDepositPayment, setIsDepositPayment] = useState(false)

  useEffect(() => {
    const status = searchParams.get('payment')
    if (status === 'success') {
      setSelectedMethod('card')
      setPaymentStep('done')
    }
  }, [searchParams])

  const handleStripeCheckout = async () => {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          price: property.price,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }
      if (data.isDeposit) setIsDepositPayment(true)
      window.location.href = data.url
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong')
      setCheckoutLoading(false)
    }
  }

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  const PAYMENT_METHODS = [
    { id: 'bank' as const, icon: Landmark, label: 'Bank Transfer', desc: 'SWIFT / SEPA wire transfer' },
    { id: 'card' as const, icon: CreditCard, label: 'Secure Card', desc: 'Visa, Mastercard, Amex' },
    { id: 'crypto' as const, icon: Bitcoin, label: 'Cryptocurrency', desc: 'BTC, ETH, USDC accepted' },
  ]

  const location = property.neighborhood
    ? `${property.neighborhood.name}, ${property.city}`
    : property.city

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div>
              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="gold">{property.listing_type === 'sale' ? 'FOR SALE' : property.listing_type === 'rent' ? 'FOR RENT' : 'OFF MARKET'}</Badge>
                    {property.is_grade_listed && property.grade_listing && (
                      <Badge variant="outline">{property.grade_listing}</Badge>
                    )}
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl text-text-primary mb-2">{property.title}</h1>
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

              <p className="text-gold font-heading text-3xl sm:text-4xl mb-8 sm:mb-10">£{property.price.toLocaleString()}</p>

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

          {/* Right Column - Payment */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-surface border border-border p-8">

                {/* Price summary */}
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-[0.65rem] font-body uppercase tracking-[0.2em] text-text-muted mb-1">Asking Price</p>
                  <p className="font-heading text-3xl text-gold">£{property.price.toLocaleString()}</p>
                  {property.price_per_week && (
                    <p className="text-xs text-text-muted font-body tracking-wider mt-1">or £{property.price_per_week.toLocaleString()} / week</p>
                  )}
                </div>

                {paymentStep === 'choose' && (
                  <>
                    <h3 className="font-heading text-lg text-text-primary mb-1">Purchase This Residence</h3>
                    <p className="text-xs text-text-muted font-body tracking-wider mb-6">Select your preferred payment method to proceed.</p>

                    <div className="space-y-3 mb-6">
                      {PAYMENT_METHODS.map(({ id, icon: Icon, label, desc }) => (
                        <button
                          key={id}
                          onClick={() => setSelectedMethod(id)}
                          className={`w-full flex items-center gap-4 px-4 py-3 border transition-all text-left ${
                            selectedMethod === id
                              ? 'border-gold bg-gold/5 text-text-primary'
                              : 'border-border hover:border-gold/40 text-text-secondary'
                          }`}
                        >
                          <Icon size={18} className={selectedMethod === id ? 'text-gold' : 'text-text-muted'} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-body font-medium uppercase tracking-[0.15em]">{label}</p>
                            <p className="text-[0.65rem] text-text-muted font-body tracking-wider mt-0.5">{desc}</p>
                            {id === 'card' && (
                              <p className="text-[0.6rem] text-text-muted/60 font-body tracking-wider mt-1">Powered by Stripe</p>
                            )}
                          </div>
                          {selectedMethod === id && (
                            <ShieldCheck size={14} className="text-gold ml-auto flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="gold"
                      fullWidth
                      size="lg"
                      disabled={!selectedMethod}
                      onClick={() => setPaymentStep('confirm')}
                    >
                      PROCEED TO PAYMENT
                    </Button>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Lock size={11} className="text-text-muted" />
                      <p className="text-[0.6rem] text-text-muted font-body uppercase tracking-[0.15em]">256-bit SSL encrypted</p>
                    </div>
                  </>
                )}

                {paymentStep === 'confirm' && (
                  <>
                    <h3 className="font-heading text-lg text-text-primary mb-1">Confirm Purchase</h3>
                    <p className="text-xs text-text-muted font-body tracking-wider mb-6">
                      Review the details below before proceeding.
                    </p>

                    <div className="space-y-3 mb-6 bg-surface-2 border border-border p-4">
                      <div className="flex justify-between text-xs font-body tracking-wider">
                        <span className="text-text-muted">Property</span>
                        <span className="text-text-primary truncate max-w-[150px] text-right">{property.title}</span>
                      </div>
                      <div className="flex justify-between text-xs font-body tracking-wider">
                        <span className="text-text-muted">Method</span>
                        <span className="text-text-primary capitalize">{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}</span>
                      </div>
                      <div className="flex justify-between text-xs font-body tracking-wider border-t border-border pt-3 mt-1">
                        <span className="text-text-muted">Total</span>
                        <span className="text-gold font-heading text-base">£{property.price.toLocaleString()}</span>
                      </div>
                    </div>

                    {checkoutError && (
                      <p className="text-xs text-red-400 font-body tracking-wider mb-3 text-center">{checkoutError}</p>
                    )}

                    <Button
                      variant="gold"
                      fullWidth
                      size="lg"
                      disabled={checkoutLoading}
                      onClick={selectedMethod === 'card' ? handleStripeCheckout : () => setPaymentStep('done')}
                    >
                      {checkoutLoading
                        ? 'REDIRECTING TO STRIPE…'
                        : selectedMethod === 'card'
                        ? 'PAY WITH STRIPE'
                        : 'CONFIRM & PAY'}
                    </Button>
                    <button
                      onClick={() => setPaymentStep('choose')}
                      className="w-full mt-3 text-[0.65rem] font-body uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors"
                    >
                      ← Change Method
                    </button>
                  </>
                )}

                {paymentStep === 'done' && (
                  <div className="text-center py-4">
                    <ShieldCheck size={36} className="text-gold mx-auto mb-4" />
                    {searchParams.get('payment') === 'success' ? (
                      <>
                        <p className="font-heading text-xl text-text-primary mb-2">Payment Confirmed</p>
                        <p className="text-xs text-text-muted font-body tracking-wider leading-relaxed">
                          {isDepositPayment
                            ? 'Your reservation deposit was received. Our private banking team will contact you within 24 hours to arrange the full transfer.'
                            : 'Your card payment was successful. Our team will contact you within 24 hours to complete the purchase.'
                          }
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-heading text-xl text-text-primary mb-2">Payment Initiated</p>
                        <p className="text-xs text-text-muted font-body tracking-wider leading-relaxed">
                          Your transaction has been received. Our private banking team will contact you within 24 hours to complete the transfer.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Enquire separately */}
              <div className="mt-4 p-5 bg-surface border border-border text-center">
                <p className="text-[0.65rem] font-body uppercase tracking-[0.2em] text-text-muted mb-3">Prefer to speak first?</p>
                <Link href="/concierge">
                  <Button variant="ghost" size="sm" fullWidth>SPEAK TO CONCIERGE</Button>
                </Link>
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
