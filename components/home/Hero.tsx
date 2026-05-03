'use client'

import Image from 'next/image'
import Button from '@/components/ui/Button'
import Link from 'next/link'

const stats = [
  { number: '120+', label: 'Projects' },
  { number: '47', label: 'Countries' },
  { number: '98', label: 'Properties' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-charcoal to-obsidian" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="z-10 animate-fade-in pt-8 sm:pt-0">
            <p className="label-caps text-text-muted mb-4 sm:mb-6">Private Residences & Advisory</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-text-primary leading-[0.95] mb-6 sm:mb-8">
              Find Your
              <br />
              <span className="italic text-gold">Perfect Home</span>
            </h1>
            <p className="text-text-secondary font-body font-light text-sm md:text-base leading-relaxed tracking-wider max-w-md mb-8 sm:mb-10">
              Access an extraordinary collection of the world&apos;s most coveted residences, 
              curated for the most discerning global clientele.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-16">
              <Link href="/portfolio">
                <Button variant="gold" size="lg">VIEW COLLECTION</Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="ghost" size="lg">EXPLORE LISTINGS</Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 sm:gap-10 md:gap-16">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-primary">{stat.number}</p>
                  <p className="label-caps text-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative h-[75vh] w-full">
              <Image
                src="/images/hero.png"
                alt="Luxury penthouse interior"
                fill
                sizes="50vw"
                className="object-cover"
                priority
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-obsidian/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="absolute bottom-6 sm:bottom-12 left-0 right-0 px-4 sm:px-6 md:px-12 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-surface/90 backdrop-blur-md border border-border p-3 sm:p-4 md:p-6 grid grid-cols-2 sm:grid-cols-4 items-end gap-3 sm:gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="label-caps text-text-muted block mb-2">Location</label>
              <input type="text" placeholder="Mayfair, Chelsea, Belgravia..." className="w-full bg-transparent border-b border-border px-0 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors font-body" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="label-caps text-text-muted block mb-2">Property Type</label>
              <select className="w-full bg-transparent border-b border-border px-0 py-2 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors font-body appearance-none">
                <option value="" className="bg-surface">All Types</option>
                <option value="penthouse" className="bg-surface">Penthouse</option>
                <option value="townhouse" className="bg-surface">Townhouse</option>
                <option value="villa" className="bg-surface">Villa</option>
                <option value="apartment" className="bg-surface">Apartment</option>
                <option value="estate" className="bg-surface">Estate</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="label-caps text-text-muted block mb-2">Price Range</label>
              <select className="w-full bg-transparent border-b border-border px-0 py-2 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors font-body appearance-none">
                <option value="" className="bg-surface">Any Price</option>
                <option value="1m-5m" className="bg-surface">£1M — £5M</option>
                <option value="5m-10m" className="bg-surface">£5M — £10M</option>
                <option value="10m-25m" className="bg-surface">£10M — £25M</option>
                <option value="25m+" className="bg-surface">£25M+</option>
              </select>
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="label-caps text-text-muted block mb-2">Bedrooms</label>
              <select className="w-full bg-transparent border-b border-border px-0 py-2 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors font-body appearance-none">
                <option value="" className="bg-surface">Any</option>
                <option value="1" className="bg-surface">1+</option>
                <option value="2" className="bg-surface">2+</option>
                <option value="3" className="bg-surface">3+</option>
                <option value="5" className="bg-surface">5+</option>
              </select>
            </div>
            <Link href="/portfolio">
              <Button variant="gold" size="md">SEARCH</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
