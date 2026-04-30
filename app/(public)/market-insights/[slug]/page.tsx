'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function ArticlePage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] mb-12">
        <Image src="/images/property-1.png" alt="Article cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[800px] mx-auto px-6 md:px-12 -mt-32 relative z-10"
      >
        <span className="label-caps text-gold mb-4 block">Market Analysis</span>
        <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary mb-4">
          London Prime Property: Q1 2024 Market Overview
        </h1>
        <p className="text-text-muted text-sm font-body tracking-wider mb-10">April 15, 2024 · 8 min read</p>

        <div className="prose-invert max-w-none space-y-6">
          <p className="text-text-secondary font-body font-light text-sm leading-relaxed tracking-wider">
            The first quarter of 2024 has revealed a nuanced picture of London&apos;s prime property market. 
            While headline figures suggest a modest correction, the reality beneath the surface tells a more compelling story of selective resilience and emerging opportunity.
          </p>
          <h2 className="font-heading text-2xl text-text-primary mt-10 mb-4">Prime Central London Performance</h2>
          <p className="text-text-secondary font-body font-light text-sm leading-relaxed tracking-wider">
            Mayfair and Belgravia continue to demonstrate remarkable price resilience, with trophy properties in W1 posting marginal gains of 1.2% quarter-on-quarter. 
            The scarcity of Grade I and Grade II listed townhouses has created a floor beneath the ultra-prime segment, with motivated UHNW buyers competing for a diminishing pool of heritage properties.
          </p>
          <p className="text-text-secondary font-body font-light text-sm leading-relaxed tracking-wider">
            Chelsea has shown more dynamic movement, with the SW3 postcode area experiencing a 3.4% increase in transaction volume. 
            This activity is largely driven by international buyers taking advantage of sterling&apos;s relative weakness and the perception of London as a safe-haven asset class.
          </p>
          <h2 className="font-heading text-2xl text-text-primary mt-10 mb-4">Emerging Trends</h2>
          <p className="text-text-secondary font-body font-light text-sm leading-relaxed tracking-wider">
            Sustainability has moved from a luxury amenity to a expectations baseline. Properties with BREEAM excellent ratings command a premium of approximately 8-12% over comparable non-certified buildings. 
            We anticipate this differential to widen as EPC regulations tighten and buyer sentiment increasingly favours environmental responsibility.
          </p>
          <p className="text-text-secondary font-body font-light text-sm leading-relaxed tracking-wider">
            The concept of the &quot;wellness home&quot; — incorporating circadian lighting, advanced air filtration, and biophilic design principles — is gaining particular traction among buyers aged 35-50, 
            a cohort that now represents 34% of transactions above the £5 million threshold.
          </p>
        </div>
      </motion.article>
    </div>
  )
}
