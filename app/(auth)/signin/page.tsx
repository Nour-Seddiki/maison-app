'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'


function SignInContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  // Show error from callback failures
  const callbackError = searchParams.get('error')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Provide user-friendly error messages
        if (authError.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please try again.')
        } else if (authError.message === 'Email not confirmed') {
          setError('Please check your email and confirm your account before signing in.')
        } else {
          setError(authError.message)
        }
        return
      }

      if (!data.user) {
        setError('Sign in failed. Please try again.')
        return
      }

      // Check profile for role (more reliable than user_metadata)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role || data.user.user_metadata?.role

      // Refresh the server-side session first, then redirect
      router.refresh()

      if (role === 'seller' || role === 'admin') {
        router.push('/seller/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
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

          {(error || callbackError) && (
            <p className="text-xs text-error font-body tracking-wider">
              {error || 'Authentication failed. Please try signing in again.'}
            </p>
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
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-body text-sm font-medium tracking-wider py-3 px-4 border border-gray-200 transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          CONTINUE WITH GOOGLE
        </button>
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

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}
