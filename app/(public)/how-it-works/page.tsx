'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Search, MessageSquare, Eye, CheckCircle, ArrowRight, Shield, Clock, Star, Key } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discover & Browse',
    subtitle: 'Explore Our Portfolio',
    description:
      'Begin your journey by exploring our curated collection of exceptional residences. Use our intelligent filters to narrow by property type, location, price range, and lifestyle requirements. Each listing has been personally vetted by our advisory team.',
    details: [
      'Browse hundreds of vetted luxury residences',
      'Filter by bedrooms, price, neighbourhood and type',
      'View high-resolution galleries and floor plans',
      'Save favourites to your personal dashboard',
    ],
    color: 'from-gold/10 to-transparent',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Submit Your Inquiry',
    subtitle: 'Connect With a Concierge',
    description:
      'Once you identify a property of interest, submit a confidential inquiry. Our dedicated estate concierge will reach out within 24 hours to understand your requirements, verify your credentials, and arrange the next steps.',
    details: [
      'Secure, confidential inquiry process',
      'Dedicated concierge assigned to your search',
      'NDA available for off-market transactions',
      'Response within 24 business hours',
    ],
    color: 'from-surface-2 to-transparent',
  },
  {
    number: '03',
    icon: Eye,
    title: 'Private Viewing',
    subtitle: 'Experience the Residence',
    description:
      "Your concierge arranges an exclusive private viewing at a time of your choosing. Experience the property firsthand, meet the seller's representative, and ask any questions. Virtual tours are available for international buyers.",
    details: [
      'In-person or virtual viewing options',
      'No group viewings — always private',
      'Access to property history and documentation',
      'Structural survey and valuation assistance',
    ],
    color: 'from-gold/10 to-transparent',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Offer & Completion',
    subtitle: 'Secure Your Residence',
    description:
      'Our advisory team guides you through the offer process, legal due diligence, and completion. We coordinate with solicitors, surveyors, and financial advisors to ensure a seamless transaction from offer to key handover.',
    details: [
      'Expert negotiation support',
      'Legal and financial advisory referrals',
      'Full documentation and title review',
      'Completion day key handover ceremony',
    ],
    color: 'from-surface-2 to-transparent',
  },
]

const guarantees = [
  { icon: Shield, title: 'Verified Listings', description: 'Every property is authenticated and verified by our senior advisors before publication.' },
  { icon: Clock, title: '24h Response', description: 'All inquiries receive a personal response from a dedicated concierge within one business day.' },
  { icon: Star, title: 'White-Glove Service', description: 'From first inquiry to key handover, a senior advisor is with you at every stage.' },
  { icon: Key, title: 'Discreet Transactions', description: 'Off-market capabilities and NDA-protected processes for buyers requiring absolute privacy.' },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,110,0.08)_0%,_transparent_60%)]" />
        <div className="relative max-w-[800px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="label-caps text-gold mb-4 tracking-[0.3em]">The Process</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl italic text-text-primary mb-6 leading-tight">
              How to Acquire<br />an Estate
            </h1>
            <p className="text-text-secondary font-body font-light text-sm sm:text-base tracking-wider leading-relaxed max-w-xl mx-auto">
              From discovery to completion, our advisory team guides every step of your acquisition. 
              The process is designed for discerning buyers who value expertise, privacy, and precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 sm:px-6 md:px-12 pb-24 sm:pb-32">
        <div className="max-w-[1100px] mx-auto space-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 1
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`grid md:grid-cols-2 gap-0 border border-border ${isEven ? 'bg-surface/30' : ''}`}
              >
                {/* Number / Icon panel */}
                <div className={`relative p-10 sm:p-14 flex flex-col justify-center ${isEven ? 'md:order-2' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-50`} />
                  <div className="relative">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-12 h-12 border border-gold/40 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-gold" />
                      </div>
                      <span className="font-heading text-5xl text-gold/20 font-bold">{step.number}</span>
                    </div>
                    <p className="label-caps text-gold mb-2">{step.subtitle}</p>
                    <h2 className="font-heading text-3xl sm:text-4xl italic text-text-primary mb-5">{step.title}</h2>
                    <p className="text-text-secondary font-body font-light text-sm tracking-wider leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className={`p-10 sm:p-14 border-t md:border-t-0 border-border flex items-center ${isEven ? 'md:order-1 md:border-r' : 'md:border-l'}`}>
                  <ul className="space-y-5 w-full">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-5 h-5 border border-gold/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                        </div>
                        <span className="text-text-secondary font-body font-light text-sm tracking-wider">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Connector line between steps */}
        <div className="max-w-[1100px] mx-auto mt-16 flex justify-center">
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-4">
                <div className="w-8 h-8 border border-gold/50 flex items-center justify-center">
                  <span className="text-[0.6rem] font-body text-gold">{s.number}</span>
                </div>
                {i < steps.length - 1 && <ArrowRight size={14} className="text-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="border-t border-border px-4 sm:px-6 md:px-12 py-20 sm:py-28 bg-charcoal">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="label-caps text-gold mb-3">Our Commitment</p>
            <h2 className="font-heading text-3xl sm:text-4xl italic text-text-primary">The Maison & Co. Promise</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {guarantees.map((g, i) => {
              const GIcon = g.icon
              return (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-surface p-8 text-center"
                >
                  <div className="w-10 h-10 mx-auto mb-5 border border-gold/30 flex items-center justify-center">
                    <GIcon size={18} className="text-gold" />
                  </div>
                  <h3 className="font-heading text-lg text-text-primary mb-3">{g.title}</h3>
                  <p className="text-text-muted font-body font-light text-xs tracking-wider leading-relaxed">{g.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 sm:px-6 md:px-12 py-20 sm:py-28 text-center">
        <div className="max-w-[600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="label-caps text-gold mb-4">Begin Your Search</p>
            <h2 className="font-heading text-3xl sm:text-4xl italic text-text-primary mb-6">
              Ready to Find Your Residence?
            </h2>
            <p className="text-text-secondary font-body font-light text-sm tracking-wider leading-relaxed mb-10">
              Browse our current portfolio of exceptional properties, or speak directly with an estate advisor to begin your confidential search.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio">
                <Button variant="gold" size="lg">BROWSE PORTFOLIO</Button>
              </Link>
              <Link href="/advisory">
                <Button variant="ghost" size="lg">SPEAK TO AN ADVISOR</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
