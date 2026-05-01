'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Profile } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function ProfileClient({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [nationality, setNationality] = useState(profile.nationality || '')
  const [currency, setCurrency] = useState(profile.preferred_currency || 'GBP')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          display_name: displayName,
          phone,
          nationality,
          preferred_currency: currency,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save changes')
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-surface border border-border p-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-body uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors"
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Display Name"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Phone" type="tel" placeholder="+44 7XXX XXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Nationality" placeholder="Your nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
        </div>
        <div>
          <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
            Preferred Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold transition-all appearance-none"
          >
            <option value="GBP">GBP (£)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {error && <p className="text-xs text-red-400 font-body">{error}</p>}
        {success && <p className="text-xs text-green-400 font-body">Changes saved successfully.</p>}

        <Button variant="gold" type="submit" disabled={saving}>
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </Button>
      </form>
    </div>
  )
}
