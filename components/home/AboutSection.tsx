'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Shield, Award, Globe, Users } from 'lucide-react'

const pillars = [
  {
    icon: Shield,
    title: 'Trusted Advisory',
    description: 'Every transaction is guided by senior advisors with decades of luxury real estate expertise.',
  },
  {
    icon: Award,
    title: 'Curated Portfolio',
    description: 'Only the most exceptional residences make it onto our platform — each personally vetted.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Access to an international network of qualified buyers, private sellers, and off-market opportunities.',
  },
  {
    icon: Users,
    title: 'Concierge Service',
    description: 'A dedicated estate concierge supports you from first inquiry through to final completion.',
  },
]

// Decorative image grid using public Unsplash URLs (no auth needed)
const images = [
  {
    src: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80',
    alt: 'Luxury penthouse interior',
    className: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    alt: 'Modern villa exterior',
    className: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
    alt: 'Pool terrace residence',
    className: 'col-span-1 row-span-1',
  },
]

export default function AboutSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-charcoal border-t border-border overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="label-caps text-gold mb-4 tracking-[0.3em]">What We Do</p>
            <h2 className="font-heading text-4xl sm:text-5xl italic text-text-primary mb-6 leading-tight">
              The Finest Homes,<br />Presented Without Compromise
            </h2>
            <p className="text-text-secondary font-body font-light text-sm sm:text-base tracking-wider leading-relaxed mb-6">
              Maison & Co. is a luxury residential property platform connecting discerning buyers and sellers with the world's most exceptional residences. We specialise in prime urban properties, countryside estates, and off-market opportunities across global markets.
            </p>
            <p className="text-text-secondary font-body font-light text-sm tracking-wider leading-relaxed mb-10">
              Unlike conventional agencies, we operate as a curated advisory house — every listing is personally reviewed, every transaction is handled with absolute discretion, and every client receives the attention of a dedicated estate concierge.
            </p>

            {/* Pillars grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {pillars.map((p, i) => {
                const Icon = p.icon
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-9 h-9 border border-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-text-primary font-body text-sm font-medium tracking-wider mb-1">{p.title}</p>
                      <p className="text-text-muted font-body font-light text-xs tracking-wider leading-relaxed">{p.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/portfolio">
                <Button variant="gold" size="lg">EXPLORE RESIDENCES</Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="ghost" size="lg">HOW IT WORKS</Button>
              </Link>
            </div>
          </motion.div>

          {/* Right — image mosaic */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 grid-rows-3 gap-3 h-[480px] sm:h-[560px]"
          >
            {/* Large image — top left, spans 2 rows */}
            <div className="col-span-1 row-span-2 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80"
                alt="Luxury interior"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Top right */}
            <div className="col-span-1 row-span-1 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"
                alt="Modern villa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Middle right */}
            <div className="col-span-1 row-span-1 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80"
                alt="Pool terrace"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Bottom full width */}
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
                alt="Grand estate exterior"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border"
        >
          {[
            { value: '500+', label: 'Residences Listed' },
            { value: '£2B+', label: 'Transaction Value' },
            { value: '40+', label: 'Countries Served' },
            { value: '98%', label: 'Client Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface py-8 px-6 text-center">
              <p className="font-heading text-3xl text-gold italic mb-2">{stat.value}</p>
              <p className="label-caps text-text-muted text-[0.65rem]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
