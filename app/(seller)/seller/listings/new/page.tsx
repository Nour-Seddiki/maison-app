'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const steps = ['Details', 'Location', 'Narrative', 'Preview']

const propertyTypes = ['Penthouse', 'Townhouse', 'Villa', 'Apartment', 'Estate', 'Mews', 'Manor']

export default function NewListingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const newImages = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 10 - images.length)
      .map(file => ({ file, preview: URL.createObjectURL(file) }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          property_type: formData.propertyType,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
          sq_ft: formData.sqFt ? parseInt(formData.sqFt) : null,
          full_address: formData.fullAddress,
          city: formData.fullAddress.split(',').pop()?.trim() || 'London',
          price: formData.price ? parseInt(formData.price) : 0,
          editorial_accent_color: formData.accentColor,
          narrative: formData.narrative,
          listing_type: 'sale',
          status: 'active',
          is_freehold: true,
          is_grade_listed: false,
          is_featured: false,
          is_off_market: false,
          features: [],
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit listing')
      }
      const { data: created } = await res.json()
      const propertyId = created?.id

      // Upload images to Supabase Storage if any
      if (propertyId && images.length > 0) {
        setUploading(true)
        const supabase = createClient()
        for (let i = 0; i < images.length; i++) {
          const { file } = images[i]
          const ext = file.name.split('.').pop()
          const path = `${propertyId}/${Date.now()}-${i}.${ext}`
          const { data: upload, error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(path, file, { cacheControl: '3600', upsert: false })
          if (!uploadError && upload) {
            const { data: { publicUrl } } = supabase.storage
              .from('property-images')
              .getPublicUrl(upload.path)
            await supabase.from('property_images').insert({
              property_id: propertyId,
              url: publicUrl,
              is_primary: i === 0,
              display_order: i,
            })
          }
        }
        setUploading(false)
      }

      router.push('/seller/listings')
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-body uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors mb-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
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

                <div>
                  <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">Property Images</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={e => handleFileSelect(e.target.files)}
                  />
                  <div
                    className="border-2 border-dashed border-border p-8 text-center hover:border-gold/30 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleFileSelect(e.dataTransfer.files) }}
                  >
                    <Upload size={20} className="mx-auto mb-3 text-text-muted" />
                    <p className="label-caps text-text-muted mb-1">Drop Images Here</p>
                    <p className="text-xs text-text-muted font-body tracking-wider">or click to browse · JPEG, PNG, WebP up to 10MB each</p>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {images.map((img, i) => (
                        <div key={i} className="relative aspect-square group">
                          <img src={img.preview} alt={`Upload ${i+1}`} className="w-full h-full object-cover" />
                          {i === 0 && <span className="absolute top-1 left-1 bg-gold text-obsidian text-[0.6rem] font-body font-medium uppercase tracking-wider px-1.5 py-0.5">Cover</span>}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                ← Back
              </button>
              {currentStep < 3 ? (
                <Button variant="gold" onClick={() => setCurrentStep(currentStep + 1)}>
                  Continue to Step {currentStep + 2} →
                </Button>
              ) : (
                <>
                  {submitError && <p className="text-xs text-red-400 font-body mr-4">{submitError}</p>}
                  <Button variant="gold" onClick={handleSubmit} disabled={submitting || uploading}>
                    {uploading ? 'UPLOADING IMAGES...' : submitting ? 'SUBMITTING...' : 'SUBMIT LISTING'}
                  </Button>
                </>
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
