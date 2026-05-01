'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'seller'>('client')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Client-side validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    if (!fullName.trim()) {
      setError('Please enter your full name.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('An account with this email already exists. Try signing in instead.')
        } else {
          setError(authError.message)
        }
        return
      }

      // Check if email confirmation is required
      // Supabase returns a user with identities = [] if the user already exists
      // and returns a session if auto-confirm is enabled
      if (data.user && !data.session) {
        // Email confirmation required
        setConfirmationSent(true)
        return
      }

      if (data.session) {
        // Explicitly set role in profile (trigger may default to 'client')
        const supabase2 = createClient()
        await supabase2.from('profiles').update({ role, full_name: fullName }).eq('id', data.user!.id)
        router.refresh()
        if (role === 'seller') {
          router.push('/seller/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show confirmation message after successful signup
  if (confirmationSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-charcoal to-obsidian" />
        <div className="relative z-10 w-full max-w-md bg-surface/80 backdrop-blur-md border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold/10 border border-gold/30">
            <CheckCircle size={32} className="text-gold" />
          </div>
          <h2 className="font-heading text-2xl text-text-primary mb-3 italic">Check Your Email</h2>
          <p className="text-sm text-text-muted font-body tracking-wider mb-6">
            We&apos;ve sent a confirmation link to <span className="text-gold">{email}</span>.
            Please check your inbox and click the link to activate your account.
          </p>
          <div className="space-y-3">
            <Link href="/signin">
              <Button variant="gold" fullWidth size="lg">
                GO TO SIGN IN →
              </Button>
            </Link>
            <button
              onClick={() => {
                setConfirmationSent(false)
                setEmail('')
                setPassword('')
                setFullName('')
              }}
              className="text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-muted hover:text-gold transition-colors"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    )
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
            placeholder="Minimum 6 characters"
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

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-border" />
          <span className="label-caps text-text-muted text-[0.6rem]">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-border" />
        </div>

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
