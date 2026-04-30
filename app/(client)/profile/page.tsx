'use client'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="label-caps text-gold mb-2">Account</p>
          <h1 className="font-heading text-4xl italic text-text-primary">Your Profile</h1>
        </motion.div>

        <div className="bg-surface border border-border p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Full Name" placeholder="Your full name" />
            <Input label="Display Name" placeholder="Display name" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Email" type="email" placeholder="your@email.com" disabled />
            <Input label="Phone" type="tel" placeholder="+44 7XXX XXXXXX" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Nationality" placeholder="Your nationality" />
            <div>
              <label className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3">Preferred Currency</label>
              <select className="w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider focus:outline-none focus:border-gold transition-all appearance-none">
                <option>GBP (£)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
          <Button variant="gold">SAVE CHANGES</Button>
        </div>
      </div>
    </div>
  )
}
