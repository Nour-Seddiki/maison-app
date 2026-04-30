'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'seller'>('client')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
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
          style={{ backgroundImage: 'url(/images/property-1.png)' }}
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
          <Link href="/signin" className="flex-1 pb-3 text-center border-b-2 border-transparent hover:border-border transition-colors">
            <span className="label-caps text-text-muted hover:text-text-secondary transition-colors">SIGN IN</span>
          </Link>
          <div className="flex-1 pb-3 text-center border-b-2 border-gold">
            <span className="label-caps text-gold">SIGN UP</span>
          </div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <Input
            id="fullName"
            label="Full Name"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@representative.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role Selector */}
          <div>
            <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={cn(
                  'py-3 px-4 text-[0.7rem] font-body uppercase tracking-[0.2em] border transition-all duration-300',
                  role === 'client'
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border text-text-muted hover:border-gold/30 hover:text-text-secondary'
                )}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={cn(
                  'py-3 px-4 text-[0.7rem] font-body uppercase tracking-[0.2em] border transition-all duration-300',
                  role === 'seller'
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border text-text-muted hover:border-gold/30 hover:text-text-secondary'
                )}
              >
                Seller
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-error font-body tracking-wider">{error}</p>
          )}

          <Button type="submit" variant="gold" fullWidth size="lg" disabled={loading}>
            {loading ? 'CREATING...' : 'CREATE ACCOUNT →'}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-[0.6rem] font-body uppercase tracking-[0.15em] text-text-muted mb-2">
          By creating an account you agree to our
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
