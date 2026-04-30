'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { KeyRound, Fingerprint } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-charcoal to-obsidian" />
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/images/hero.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian to-transparent" />
      </div>

      {/* Logo */}
      <div className="relative z-10 text-center mb-10">
        <Link href="/">
          <h1 className="font-heading text-3xl text-gold italic">Maison & Co.</h1>
        </Link>
        <p className="label-caps text-text-muted mt-2">Private Residences & Advisory</p>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-surface/80 backdrop-blur-md border border-border p-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <div className="flex-1 pb-3 text-center border-b-2 border-gold">
            <span className="label-caps text-gold">SIGN IN</span>
          </div>
          <Link href="/signup" className="flex-1 pb-3 text-center border-b-2 border-transparent hover:border-border transition-colors">
            <span className="label-caps text-text-muted hover:text-text-secondary transition-colors">SIGN UP</span>
          </Link>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@representative.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary">
                Password
              </label>
              <button type="button" className="text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted hover:text-gold transition-colors">
                FORGOT?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
            />
          </div>

          {/* Remember */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 bg-surface border border-border accent-gold"
            />
            <span className="text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-muted">
              Remember my credentials
            </span>
          </label>

          {error && (
            <p className="text-xs text-error font-body tracking-wider">{error}</p>
          )}

          <Button type="submit" variant="gold" fullWidth size="lg" disabled={loading}>
            {loading ? 'ENTERING...' : 'ENTER MAISON →'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-border" />
          <span className="label-caps text-text-muted text-[0.6rem]">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Alt Methods */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="dark" size="md">
            <KeyRound size={14} className="mr-2" />
            DIGITAL KEY
          </Button>
          <Button variant="dark" size="md">
            <Fingerprint size={14} className="mr-2" />
            BIOMETRIC
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-[0.6rem] font-body uppercase tracking-[0.15em] text-text-muted mb-2">
          By accessing this portal you agree to our
        </p>
        <div className="flex items-center justify-center gap-6">
          <button className="text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted hover:text-gold transition-colors">
            Privacy Protocol
          </button>
          <button className="text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted hover:text-gold transition-colors">
            NDA Terms
          </button>
        </div>
      </div>
    </div>
  )
}
