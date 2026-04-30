'use client'

import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export default function PrivateSalesPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg text-center"
      >
        <div className="w-16 h-16 mx-auto mb-8 bg-surface border border-gold/30 flex items-center justify-center">
          <Lock size={24} className="text-gold" />
        </div>
        <p className="label-caps text-gold mb-3">Exclusive Access</p>
        <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary mb-6">Private Sales</h1>
        <p className="text-text-secondary font-body font-light text-sm tracking-wider leading-relaxed mb-10">
          Our private sales division handles off-market properties for buyers and sellers who value absolute discretion. 
          Access requires NDA verification through your dedicated concierge.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="gold" size="lg">REQUEST ACCESS</Button>
          <Button variant="ghost" size="lg">CONTACT CONCIERGE</Button>
        </div>
      </motion.div>
    </div>
  )
}
