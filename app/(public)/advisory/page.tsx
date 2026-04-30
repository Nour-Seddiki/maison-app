'use client'

import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, Globe, Briefcase } from 'lucide-react'

const services = [
  { icon: TrendingUp, title: 'Portfolio Strategy', description: 'Tailored investment strategies for luxury real estate portfolios across prime global locations.' },
  { icon: Shield, title: 'Risk Assessment', description: 'Comprehensive due diligence and risk analysis for high-value property acquisitions.' },
  { icon: Globe, title: 'Global Markets', description: 'Expert insights into international property markets with deep local knowledge.' },
  { icon: Briefcase, title: 'Wealth Structuring', description: 'Tax-efficient property ownership structures and family office advisory services.' },
]

export default function AdvisoryPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <p className="label-caps text-gold mb-3">Investment Advisory</p>
          <h1 className="font-heading text-5xl md:text-7xl italic text-text-primary mb-6">Strategic Counsel</h1>
          <p className="text-text-secondary font-body font-light text-sm md:text-base tracking-wider max-w-2xl mx-auto">
            Our advisory team combines decades of market expertise with a bespoke approach to wealth preservation through prime real estate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border p-8 hover:border-gold/30 transition-colors group"
            >
              <service.icon size={28} className="text-gold mb-6" />
              <h3 className="font-heading text-2xl text-text-primary mb-3">{service.title}</h3>
              <p className="text-sm text-text-secondary font-body font-light tracking-wider leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="gold" size="lg">SCHEDULE CONSULTATION</Button>
        </div>
      </div>
    </div>
  )
}
