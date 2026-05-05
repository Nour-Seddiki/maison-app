'use client'

import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'

const team = [
  { name: 'Alexander Cross', title: 'Senior Estate Director', specialization: 'Prime Central London', initials: 'AC' },
  { name: 'Diana Moreau', title: 'Head of Private Sales', specialization: 'Off-Market Acquisitions', initials: 'DM' },
  { name: 'Felix Sterling', title: 'Investment Strategist', specialization: 'Portfolio Advisory', initials: 'FS' },
  { name: 'Isabella Chen', title: 'International Director', specialization: 'Asia-Pacific Markets', initials: 'IC' },
  { name: 'Sebastian Hale', title: 'Luxury Rentals Director', specialization: 'Short & Long Term Lets', initials: 'SH' },
  { name: 'Arabella Sinclair', title: 'Heritage Property Specialist', specialization: 'Grade Listed Buildings', initials: 'AS' },
]

export default function ConciergePage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <p className="label-caps text-gold mb-3">Your Dedicated Team</p>
          <h1 className="font-heading text-5xl md:text-7xl italic text-text-primary mb-6">Estate Concierge</h1>
          <p className="text-text-secondary font-body font-light text-sm md:text-base tracking-wider max-w-2xl mx-auto">
            Each concierge brings unparalleled expertise in their domain, ensuring your property journey is guided by the finest minds in luxury real estate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {team.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border p-8 text-center group hover:border-gold/30 transition-colors"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-surface-2 border border-border flex items-center justify-center group-hover:border-gold/30 transition-colors">
                <span className="font-heading text-2xl text-gold/60 group-hover:text-gold transition-colors">{person.initials}</span>
              </div>
              <h3 className="font-heading text-xl text-text-primary mb-1">{person.name}</h3>
              <p className="text-xs text-gold font-body tracking-wider mb-2">{person.title}</p>
              <p className="text-xs text-text-muted font-body tracking-wider">{person.specialization}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-surface border border-gold/20 p-12 text-center">
          <h3 className="font-heading text-3xl italic text-text-primary mb-4">Connect With Our Team</h3>
          <p className="text-text-secondary font-body font-light text-sm tracking-wider mb-8">
            <a href="mailto:seddikimednour@gmail.com" className="hover:text-gold transition-colors">seddikimednour@gmail.com</a>
          </p>
          <Button variant="gold" size="lg">BOOK APPOINTMENT</Button>
        </div>
      </div>
    </div>
  )
}
