'use client'

import Image from 'next/image'

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

    </section>
  )
}
