'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, User, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/portfolio', label: 'PORTFOLIO' },
  { href: '/private-sales', label: 'PRIVATE SALES' },
  { href: '/advisory', label: 'ADVISORY' },
  { href: '/concierge', label: 'CONCIERGE' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string; role?: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Check current session
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single()

        setUser({
          id: authUser.id,
          email: authUser.email,
          role: profile?.role || authUser.user_metadata?.role || 'client',
        })
      } else {
        setUser(null)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'client',
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setShowUserMenu(false)
    router.push('/')
    router.refresh()
  }

  const dashboardHref = user?.role === 'seller' || user?.role === 'admin'
    ? '/seller/dashboard'
    : '/dashboard'

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-obsidian/80 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-heading text-2xl text-gold italic tracking-wide">
              Maison & Co.
            </span>
          </Link>

          {/* Center Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="text-text-secondary hover:text-gold transition-colors">
              <Search size={18} />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-text-secondary hover:text-gold transition-colors"
                >
                  <div className="w-8 h-8 bg-surface-2 border border-border flex items-center justify-center rounded-full">
                    <User size={14} className="text-gold" />
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-56 bg-surface border border-border shadow-xl">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs text-text-muted font-body tracking-wider truncate">{user.email}</p>
                        <p className="text-[0.6rem] text-gold font-body uppercase tracking-[0.2em] mt-1">
                          {user.role}
                        </p>
                      </div>
                      <Link
                        href={dashboardHref}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-secondary hover:text-gold hover:bg-surface-2/50 transition-colors"
                      >
                        <User size={14} />
                        DASHBOARD
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-secondary hover:text-error hover:bg-surface-2/50 transition-colors border-t border-border"
                      >
                        <LogOut size={14} />
                        SIGN OUT
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  LOGIN
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-text-secondary hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-body font-light uppercase tracking-[0.3em] text-text-primary hover:text-gold transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border w-16 my-4" />
          {user ? (
            <>
              <Link href={dashboardHref} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="md">
                  DASHBOARD
                </Button>
              </Link>
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileOpen(false)
                }}
                className="text-sm font-body font-light uppercase tracking-[0.3em] text-text-muted hover:text-error transition-colors"
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <Link href="/signin" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" size="md">
                LOGIN
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  )
}
