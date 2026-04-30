import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

const concierges = [
  { name: 'Alexander Cross', title: 'Senior Estate Director', specialization: 'Prime Central London', initials: 'AC' },
  { name: 'Diana Moreau', title: 'Head of Private Sales', specialization: 'Off-Market Acquisitions', initials: 'DM' },
  { name: 'Felix Sterling', title: 'Investment Strategist', specialization: 'Portfolio Advisory', initials: 'FS' },
  { name: 'Isabella Chen', title: 'International Director', specialization: 'Asia-Pacific Markets', initials: 'IC' },
]

export default function EstateConcierges() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <AnimateOnScroll className="text-center mb-16">
          <p className="label-caps text-gold mb-3">Your Dedicated Team</p>
          <h2 className="font-heading text-4xl md:text-5xl italic text-text-primary">Estate Concierges</h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {concierges.map((person, i) => (
            <AnimateOnScroll key={i} delay={i * 100} className="text-center group">
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 bg-surface-2 border border-border flex items-center justify-center group-hover:border-gold/30 transition-colors duration-500">
                <span className="font-heading text-3xl text-gold/60 group-hover:text-gold transition-colors duration-500">{person.initials}</span>
              </div>
              <h3 className="font-heading text-xl text-text-primary mb-1">{person.name}</h3>
              <p className="text-xs text-gold font-body tracking-wider mb-2">{person.title}</p>
              <p className="text-xs text-text-muted font-body tracking-wider">{person.specialization}</p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
