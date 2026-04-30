'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/portfolio', label: 'PORTFOLIO' },
  { href: '/private-sales', label: 'PRIVATE SALES' },
  { href: '/advisory', label: 'ADVISORY' },
  { href: '/concierge', label: 'CONCIERGE' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                LOGIN
              </Button>
            </Link>
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
          <Link href="/signin" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="md">
              LOGIN
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
