'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, User, LogOut, Bell, Home, Building2, Info, BookOpen, Settings } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/', label: 'HOME', icon: Home },
  { href: '/portfolio', label: 'BROWSE', icon: Search },
  { href: '/how-it-works', label: 'HOW IT WORKS', icon: BookOpen },
  { href: '/advisory', label: 'ABOUT', icon: Info },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string; role?: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string | null; link: string | null; is_read: boolean; created_at: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'client',
        })
        // Fetch notifications
        fetch('/api/notifications').then(r => r.json()).then(({ data }) => {
          if (data) setNotifications(data)
        }).catch(() => {})
      } else {
        setUser(null)
      }
    }

    getUser()

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
    setMobileOpen(false)
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
            ? 'bg-obsidian/90 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-heading text-xl md:text-2xl text-gold italic tracking-wide">
              Maison & Co.
            </span>
          </Link>

          {/* Desktop Center Nav */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
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

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }}
                  className="relative text-text-secondary hover:text-gold transition-colors p-1"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {notifications.some(n => !n.is_read) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full" />
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 top-10 z-50 w-80 bg-surface border border-border shadow-2xl">
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <p className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-text-secondary">Notifications</p>
                        {notifications.some(n => !n.is_read) && (
                          <button
                            onClick={async () => {
                              await fetch('/api/notifications', { method: 'PATCH' })
                              setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
                            }}
                            className="text-[0.6rem] font-body uppercase tracking-wider text-gold hover:text-gold/70 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-border">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <p className="text-xs text-text-muted font-body tracking-wider">No notifications</p>
                          </div>
                        ) : notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (n.link) router.push(n.link)
                              setShowNotifications(false)
                            }}
                            className={`px-4 py-3 cursor-pointer hover:bg-surface-2/50 transition-colors ${!n.is_read ? 'border-l-2 border-gold' : ''}`}
                          >
                            <p className={`text-xs font-body font-medium ${!n.is_read ? 'text-text-primary' : 'text-text-secondary'}`}>{n.title}</p>
                            {n.message && <p className="text-[0.65rem] font-body text-text-muted mt-0.5 line-clamp-2">{n.message}</p>}
                            <p className="text-[0.6rem] text-text-muted font-body mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* User menu or login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }}
                  className="flex items-center gap-2 text-text-secondary hover:text-gold transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-8 h-8 bg-surface-2 border border-border flex items-center justify-center rounded-full">
                    <User size={14} className="text-gold" />
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-12 z-50 w-56 bg-surface border border-border shadow-xl">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs text-text-muted font-body tracking-wider truncate">{user.email}</p>
                        <p className="text-[0.6rem] text-gold font-body uppercase tracking-[0.2em] mt-1">{user.role}</p>
                      </div>
                      <Link
                        href={dashboardHref}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-secondary hover:text-gold hover:bg-surface-2/50 transition-colors"
                      >
                        <User size={14} />
                        DASHBOARD
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-secondary hover:text-gold hover:bg-surface-2/50 transition-colors"
                      >
                        <User size={14} />
                        PROFILE
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-secondary hover:text-gold hover:bg-surface-2/50 transition-colors"
                      >
                        <Settings size={14} />
                        SETTINGS
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 text-[0.7rem] font-body uppercase tracking-[0.15em] text-text-secondary hover:text-red-400 hover:bg-surface-2/50 transition-colors border-t border-border"
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
                <Button variant="ghost" size="sm">LOGIN</Button>
              </Link>
            )}
          </div>

          {/* Mobile right: notifications + menu toggle */}
          <div className="flex lg:hidden items-center gap-3">
            {user && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-text-secondary hover:text-gold transition-colors p-1"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notifications.some(n => !n.is_read) && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full" />
                )}
              </button>
            )}
            <button
              className="text-text-secondary hover:text-gold transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-obsidian/97 backdrop-blur-md flex flex-col lg:hidden overflow-y-auto">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-shrink-0">
            <span className="font-heading text-xl text-gold italic">Maison & Co.</span>
            <button
              className="text-text-secondary hover:text-gold transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex flex-col px-5 pt-8 pb-4 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 px-4 py-4 text-sm font-body uppercase tracking-[0.25em] text-text-secondary hover:text-gold hover:bg-surface/50 transition-colors rounded-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={16} className="text-gold/60" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="border-t border-border mx-5 my-2" />

          {/* Auth section */}
          <div className="flex flex-col px-5 py-4 gap-1">
            {user ? (
              <>
                <div className="px-4 py-3 mb-2">
                  <p className="text-xs text-text-muted font-body tracking-wider truncate">{user.email}</p>
                  <p className="text-[0.6rem] text-gold font-body uppercase tracking-[0.2em] mt-1">{user.role}</p>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 text-sm font-body uppercase tracking-[0.25em] text-text-secondary hover:text-gold hover:bg-surface/50 transition-colors rounded-sm"
                >
                  <User size={16} className="text-gold/60" />
                  DASHBOARD
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 text-sm font-body uppercase tracking-[0.25em] text-text-secondary hover:text-gold hover:bg-surface/50 transition-colors rounded-sm"
                >
                  <User size={16} className="text-gold/60" />
                  PROFILE
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 text-sm font-body uppercase tracking-[0.25em] text-text-secondary hover:text-gold hover:bg-surface/50 transition-colors rounded-sm"
                >
                  <Settings size={16} className="text-gold/60" />
                  SETTINGS
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-4 px-4 py-4 text-sm font-body uppercase tracking-[0.25em] text-text-secondary hover:text-red-400 hover:bg-surface/50 transition-colors rounded-sm text-left"
                >
                  <LogOut size={16} className="text-red-400/60" />
                  SIGN OUT
                </button>
              </>
            ) : (
              <div className="px-4 py-2">
                <Link href="/signin" onClick={() => setMobileOpen(false)}>
                  <Button variant="gold" size="md" className="w-full">LOGIN</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile notifications panel */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
          <div className="fixed top-16 right-4 z-50 w-80 bg-surface border border-border shadow-2xl lg:hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="text-[0.7rem] font-body uppercase tracking-[0.2em] text-text-secondary">Notifications</p>
              {notifications.some(n => !n.is_read) && (
                <button
                  onClick={async () => {
                    await fetch('/api/notifications', { method: 'PATCH' })
                    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
                  }}
                  className="text-[0.6rem] font-body uppercase tracking-wider text-gold hover:text-gold/70 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-text-muted font-body tracking-wider">No notifications</p>
                </div>
              ) : notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.link) router.push(n.link)
                    setShowNotifications(false)
                  }}
                  className={`px-4 py-3 cursor-pointer hover:bg-surface-2/50 transition-colors ${!n.is_read ? 'border-l-2 border-gold' : ''}`}
                >
                  <p className={`text-xs font-body font-medium ${!n.is_read ? 'text-text-primary' : 'text-text-secondary'}`}>{n.title}</p>
                  {n.message && <p className="text-[0.65rem] font-body text-text-muted mt-0.5 line-clamp-2">{n.message}</p>}
                  <p className="text-[0.6rem] text-text-muted font-body mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
