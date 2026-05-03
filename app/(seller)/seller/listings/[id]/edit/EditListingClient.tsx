'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

const propertyTypes = ['Penthouse', 'Townhouse', 'Villa', 'Apartment', 'Estate', 'Mews', 'Manor']

interface ListingData {
  id: string
  title: string
  property_type: string | null
  bedrooms: number | null
  bathrooms: number | null
  sq_ft: number | null
  full_address: string | null
  city: string | null
  price: number
  narrative: string | null
  editorial_accent_color: string | null
}

export default function EditListingClient({ listing }: { listing: ListingData }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: listing.title || '',
    propertyType: listing.property_type || 'apartment',
    bedrooms: listing.bedrooms?.toString() || '',
    bathrooms: listing.bathrooms?.toString() || '',
    sqFt: listing.sq_ft?.toString() || '',
    fullAddress: listing.full_address || '',
    price: listing.price?.toString() || '',
    accentColor: listing.editorial_accent_color || '#C9A96E',
    narrative: listing.narrative || '',
  })

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError('')
    try {
      const res = await fetch(`/api/properties/${listing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          property_type: form.propertyType,
          bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
          bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : null,
          sq_ft: form.sqFt ? parseInt(form.sqFt) : null,
          full_address: form.fullAddress,
          city: form.fullAddress.split(',').pop()?.trim() || listing.city,
          price: form.price ? parseInt(form.price) : 0,
          editorial_accent_color: form.accentColor,
          narrative: form.narrative,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-surface border border-border p-8 space-y-8">

      {/* Primary Attributes */}
      <div>
        <p className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-gold mb-5 pb-3 border-b border-border">
          Primary Attributes
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Property Title"
            placeholder="e.g. The Kensington Penthouse"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
          <div>
            <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
              Property Type
            </label>
            <select
              value={form.propertyType}
              onChange={(e) => set('propertyType', e.target.value)}
              className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold transition-all appearance-none"
            >
              {propertyTypes.map((t) => (
                <option key={t} value={t.toLowerCase()} className="bg-surface">{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Input label="Bedrooms" type="number" placeholder="4" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} />
          <Input label="Bathrooms" type="number" placeholder="3.5" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} />
          <Input label="Sq. Ft" type="number" placeholder="4200" value={form.sqFt} onChange={(e) => set('sqFt', e.target.value)} />
        </div>
      </div>

      {/* Location & Price */}
      <div>
        <p className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-gold mb-5 pb-3 border-b border-border">
          Location & Price
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Address"
            placeholder="London, United Kingdom"
            value={form.fullAddress}
            onChange={(e) => set('fullAddress', e.target.value)}
          />
          <Input
            label="Price (£)"
            type="number"
            placeholder="12500000"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
          />
        </div>
        <div className="mt-6">
          <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
            Editorial Accent Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.accentColor}
              onChange={(e) => set('accentColor', e.target.value)}
              className="w-10 h-10 bg-transparent border border-border cursor-pointer"
            />
            <span className="text-sm text-text-muted font-body tracking-wider">{form.accentColor}</span>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div>
        <p className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-gold mb-5 pb-3 border-b border-border">
          Narrative
        </p>
        <textarea
          rows={10}
          placeholder="Craft the story of your residence..."
          value={form.narrative}
          onChange={(e) => set('narrative', e.target.value)}
          className="w-full bg-surface border border-border px-4 py-4 text-sm text-text-primary font-body font-light tracking-wider leading-relaxed placeholder:text-text-muted focus:outline-none focus:border-gold transition-all resize-none"
        />
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 px-4 py-3">
          <p className="text-xs text-red-400 font-body">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 px-4 py-3">
          <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
          <p className="text-xs text-green-400 font-body tracking-wider">Listing updated successfully.</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="gold" type="submit" disabled={saving}>
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </Button>
        <button
          type="button"
          onClick={() => router.push('/seller/listings')}
          className="text-xs font-body uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors"
        >
          ← Back to Listings
        </button>
      </div>
    </form>
  )
}
