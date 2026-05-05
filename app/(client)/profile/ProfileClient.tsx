'use client'

import { useState, useRef } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Profile } from '@/types'
import { CreditCard, User, Phone, Globe, Wallet, CheckCircle, Upload, X, ImageIcon, MapPin, Camera } from 'lucide-react'

const CURRENCIES = [
  { value: 'GBP', label: 'GBP — British Pound (£)' },
  { value: 'USD', label: 'USD — US Dollar ($)' },
  { value: 'EUR', label: 'EUR — Euro (€)' },
  { value: 'DZD', label: 'DZD — Algerian Dinar (د.ج)' },
  { value: 'AED', label: 'AED — UAE Dirham (د.إ)' },
  { value: 'SAR', label: 'SAR — Saudi Riyal (﷼)' },
  { value: 'MAD', label: 'MAD — Moroccan Dirham (د.م.)' },
  { value: 'QAR', label: 'QAR — Qatari Riyal (ر.ق)' },
]

export default function ProfileClient({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [nationality, setNationality] = useState(profile.nationality || '')
  const [nationalId, setNationalId] = useState(profile.national_id || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [location, setLocation] = useState(profile.location || '')
  const [currency, setCurrency] = useState(profile.preferred_currency || 'GBP')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)

  // ID card image state
  const [idImageUrl, setIdImageUrl] = useState<string | null>(profile.national_id_image_url || null)
  const [idImageFile, setIdImageFile] = useState<File | null>(null)
  const [idImagePreview, setIdImagePreview] = useState<string | null>(profile.national_id_image_url || null)
  const [uploadingId, setUploadingId] = useState(false)
  const idImageRef = useRef<HTMLInputElement>(null)

  const handleAvatarSelect = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar must be under 5MB')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setError('')
  }

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return avatarUrl
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', avatarFile)
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setAvatarUrl(data.url)
      return data.url
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleIdImageSelect = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('ID image must be under 5MB')
      return
    }
    setIdImageFile(file)
    setIdImagePreview(URL.createObjectURL(file))
    setError('')
  }

  const uploadIdImage = async (): Promise<string | null> => {
    if (!idImageFile) return idImageUrl
    setUploadingId(true)
    try {
      const formData = new FormData()
      formData.append('file', idImageFile)
      const res = await fetch('/api/profile/id-document', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setIdImageUrl(data.url)
      return data.url
    } finally {
      setUploadingId(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError('')

    try {
      // Upload avatar and ID image first if new ones were selected
      const [uploadedAvatarUrl, uploadedIdImageUrl] = await Promise.all([
        uploadAvatar(),
        uploadIdImage(),
      ])

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          display_name: displayName,
          phone,
          nationality,
          national_id: nationalId,
          national_id_image_url: uploadedIdImageUrl,
          avatar_url: uploadedAvatarUrl,
          preferred_currency: currency,
          bio,
          location,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save changes')
      }

      setAvatarFile(null)
      setIdImageFile(null)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Info banner */}
      <div className="flex items-center gap-3 bg-surface-2 border border-gold/20 px-5 py-3 mb-8">
        <CheckCircle size={16} className="text-gold flex-shrink-0" />
        <p className="text-xs font-body tracking-wider text-text-secondary">
          A complete profile speeds up property inquiries and verifications.
        </p>
      </div>

        <form onSubmit={handleSave} className="bg-surface border border-border p-6 sm:p-8 space-y-8">

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-2 border-2 border-border flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading text-3xl italic text-gold">
                    {(profile.display_name || profile.full_name || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-obsidian border border-gold/40 rounded-full flex items-center justify-center hover:border-gold transition-colors"
              >
                <Camera size={13} className="text-gold" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-xs font-body uppercase tracking-[0.15em] text-text-muted">Profile Photo</p>
              {avatarFile && (
                <button
                  type="button"
                  onClick={() => { setAvatarFile(null); setAvatarPreview(profile.avatar_url || null) }}
                  className="mt-1 text-[0.65rem] font-body text-red-400 hover:text-red-300 tracking-wider"
                >
                  Remove change
                </button>
              )}
            </div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleAvatarSelect(e.target.files?.[0] || null)}
            />
            {uploadingAvatar && <p className="text-xs text-gold font-body tracking-wider">Uploading…</p>}
          </div>

          {/* Section: Personal Info */}
          <div>
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <User size={14} className="text-gold" />
              <span className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-gold">Personal Information</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Display Name"
                placeholder="How you appear publicly"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            {/* Bio */}
            <div className="mt-5">
              <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="A short introduction about yourself..."
                rows={3}
                maxLength={300}
                className="w-full bg-surface border border-border px-4 py-3 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 resize-none"
              />
              <p className="text-[0.65rem] text-text-muted font-body text-right mt-1">{bio.length}/300</p>
            </div>
          </div>

          {/* Section: Contact */}
          <div>
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Phone size={14} className="text-gold" />
              <span className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-gold">Contact & Preferences</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+213 XXX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Location"
                placeholder="e.g. London, United Kingdom"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div>
                <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
                  Preferred Currency
                </label>
                <div className="relative">
                  <Wallet size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-surface border border-border pl-9 pr-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold transition-all appearance-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.value} value={c.value} className="bg-surface">{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Identity */}
          <div>
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Globe size={14} className="text-gold" />
              <span className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-gold">Identity & Verification</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <Input
                label="Nationality"
                placeholder="e.g. Algerian, French…"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
              <div>
                <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
                  National ID / Passport Number
                </label>
                <div className="relative">
                  <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    placeholder="ID or passport number"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full bg-surface border border-border pl-9 pr-4 py-3 text-sm text-text-primary font-body font-light tracking-wider placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                  />
                </div>
                <p className="mt-2 text-[0.65rem] text-text-muted font-body tracking-wider">
                  Used only for identity verification. Stored securely.
                </p>
              </div>
            </div>

            {/* ID Card Image Upload */}
            <div>
              <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
                ID Card / Passport Photo
              </label>

              <input
                ref={idImageRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleIdImageSelect(e.target.files?.[0] || null)}
              />

              {idImagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={idImagePreview}
                    alt="ID document"
                    className="h-36 w-auto max-w-full object-contain border border-border bg-surface-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIdImagePreview(null)
                      setIdImageFile(null)
                      setIdImageUrl(null)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-obsidian border border-border flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => idImageRef.current?.click()}
                    className="mt-2 flex items-center gap-1.5 text-[0.65rem] font-body uppercase tracking-wider text-gold hover:text-gold/70 transition-colors"
                  >
                    <Upload size={11} /> Replace Image
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-gold/40 transition-colors"
                  onClick={() => idImageRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleIdImageSelect(e.dataTransfer.files[0] || null)
                  }}
                >
                  <ImageIcon size={22} className="text-text-muted" />
                  <div className="text-center">
                    <p className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-text-muted">Upload ID Card Image</p>
                    <p className="text-[0.65rem] text-text-muted font-body mt-1 tracking-wider">JPEG, PNG or WebP · Max 5MB</p>
                  </div>
                </div>
              )}

              {uploadingId && (
                <p className="text-xs text-gold font-body tracking-wider mt-2">Uploading image…</p>
              )}
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 px-4 py-3">
              <p className="text-xs text-red-400 font-body">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 px-4 py-3">
              <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
              <p className="text-xs text-green-400 font-body tracking-wider">Profile updated successfully.</p>
            </div>
          )}

          <Button variant="gold" type="submit" disabled={saving || uploadingId || uploadingAvatar}>
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </form>
    </div>
  )
}

