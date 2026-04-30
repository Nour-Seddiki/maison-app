'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const steps = ['Details', 'Location', 'Narrative', 'Preview']

const propertyTypes = ['Penthouse', 'Townhouse', 'Villa', 'Apartment', 'Estate', 'Mews', 'Manor']

export default function NewListingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'townhouse',
    bedrooms: '',
    bathrooms: '',
    sqFt: '',
    fullAddress: '',
    price: '',
    accentColor: '#C9A96E',
    narrative: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-16">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center border-2 transition-colors ${
                  i <= currentStep ? 'border-gold text-gold' : 'border-border text-text-muted'
                } ${i < currentStep ? 'bg-gold/10' : ''}`}>
                  {i < currentStep ? <Check size={16} /> : <span className="text-sm font-body">{i + 1}</span>}
                </div>
                <span className={`label-caps mt-2 ${i <= currentStep ? 'text-gold' : 'text-text-muted'}`}>{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 md:w-24 h-px mx-4 ${i < currentStep ? 'bg-gold' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary mb-3">
            Curate Your Listing
          </h1>
          <p className="text-text-secondary font-body font-light text-sm tracking-wider">
            Begin the journey of presenting your residence to our global network of collectors and connoisseurs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            {/* Step 1: Primary Attributes */}
            {currentStep === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl text-text-primary mb-1">
                    <span className="label-caps text-gold mr-3">01</span>Primary Attributes
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Property Title" placeholder="e.g. The Kensington Penthouse" value={formData.title} onChange={(e) => updateField('title', e.target.value)} />
                  <div>
                    <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">Property Type</label>
                    <select value={formData.propertyType} onChange={(e) => updateField('propertyType', e.target.value)} className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold transition-all appearance-none">
                      {propertyTypes.map((t) => (
                        <option key={t} value={t.toLowerCase()} className="bg-surface">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <Input label="Bedrooms" type="number" placeholder="4" value={formData.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} />
                  <Input label="Bathrooms" type="number" placeholder="3.5" value={formData.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} />
                  <Input label="Sq. Ft" type="number" placeholder="4,200" value={formData.sqFt} onChange={(e) => updateField('sqFt', e.target.value)} />
                </div>
              </motion.div>
            )}

            {/* Step 2: Location & Presentation */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl text-text-primary mb-1">
                    <span className="label-caps text-gold mr-3">02</span>Location & Presentation
                  </h3>
                </div>

                <Input label="Full Address" placeholder="London, United Kingdom" value={formData.fullAddress} onChange={(e) => updateField('fullAddress', e.target.value)} />

                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Price Expectation (£)" type="number" placeholder="12,500,000" value={formData.price} onChange={(e) => updateField('price', e.target.value)} />
                  <div>
                    <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">Editorial Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={formData.accentColor} onChange={(e) => updateField('accentColor', e.target.value)} className="w-10 h-10 bg-transparent border border-border cursor-pointer" />
                      <span className="text-sm text-text-muted font-body tracking-wider">{formData.accentColor}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Narrative */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl text-text-primary mb-1">
                    <span className="label-caps text-gold mr-3">03</span>Narrative
                  </h3>
                </div>

                <div>
                  <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">Editorial Description</label>
                  <textarea
                    rows={12}
                    placeholder="Craft the story of your residence..."
                    value={formData.narrative}
                    onChange={(e) => updateField('narrative', e.target.value)}
                    className="w-full bg-surface border border-border px-4 py-4 text-sm text-text-primary font-body font-light tracking-wider leading-relaxed placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all resize-none"
                  />
                </div>

                <div className="border-2 border-dashed border-border p-12 text-center hover:border-gold/30 transition-colors cursor-pointer">
                  <p className="label-caps text-text-muted mb-2">Drop Images Here</p>
                  <p className="text-xs text-text-muted font-body tracking-wider">or click to browse · JPEG, PNG up to 10MB</p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl text-text-primary mb-1">
                    <span className="label-caps text-gold mr-3">04</span>Preview & Submit
                  </h3>
                </div>

                <div className="bg-surface border border-border p-8 space-y-6">
                  <h2 className="font-heading text-3xl text-text-primary">{formData.title || 'Property Title'}</h2>
                  <p className="text-text-secondary text-sm font-body tracking-wider">{formData.fullAddress || 'Address not set'}</p>
                  <div className="flex gap-4 flex-wrap">
                    <Badge variant="gold">FOR SALE</Badge>
                    <Badge variant="outline">{formData.propertyType || 'Type'}</Badge>
                  </div>
                  <p className="text-gold font-heading text-3xl">
                    {formData.price ? `£${Number(formData.price).toLocaleString()}` : '£0'}
                  </p>
                  <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                    <div><span className="label-caps text-text-muted block mb-1">Bedrooms</span><span className="text-text-primary font-heading text-lg">{formData.bedrooms || '—'}</span></div>
                    <div><span className="label-caps text-text-muted block mb-1">Bathrooms</span><span className="text-text-primary font-heading text-lg">{formData.bathrooms || '—'}</span></div>
                    <div><span className="label-caps text-text-muted block mb-1">Sq. Ft</span><span className="text-text-primary font-heading text-lg">{formData.sqFt || '—'}</span></div>
                  </div>
                  {formData.narrative && (
                    <div className="border-t border-border pt-6">
                      <p className="text-sm text-text-secondary font-body font-light leading-relaxed tracking-wider">{formData.narrative}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-border">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="text-xs font-body uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors"
                disabled={currentStep === 0}
              >
                ← Save Draft
              </button>
              {currentStep < 3 ? (
                <Button variant="gold" onClick={() => setCurrentStep(currentStep + 1)}>
                  Continue to Step {currentStep + 2} →
                </Button>
              ) : (
                <Button variant="gold">SUBMIT FOR REVIEW</Button>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-28">
              <div className="bg-surface border border-border overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                  <span className="label-caps text-text-muted">Live Preview</span>
                  <div className="w-2 h-2 bg-gold rounded-full" />
                </div>
                <div className="relative aspect-[4/5]">
                  <Image src="/images/property-3.png" alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-obsidian/90 to-transparent">
                    <Badge variant="gold" className="mb-3">FOR SALE</Badge>
                    <h4 className="font-heading text-xl text-white mb-1">{formData.title || 'Kensington Gardens Estate'}</h4>
                    <p className="text-xs text-text-secondary font-body tracking-wider">{formData.fullAddress || 'W8 London, UK'}</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="label-caps text-text-muted">Price</span>
                    <span className="text-gold font-heading">{formData.price ? `£${Number(formData.price).toLocaleString()}` : '£12,500,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="label-caps text-text-muted">Status</span>
                    <span className="label-caps text-text-secondary">Draft in Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
