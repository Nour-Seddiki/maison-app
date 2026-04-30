import Button from '@/components/ui/Button'
import Link from 'next/link'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

export default function BeginLegacy() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <AnimateOnScroll className="max-w-[1400px] mx-auto bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/20 p-12 md:p-20 text-center">
        <p className="label-caps text-gold mb-4">The Journey Begins</p>
        <h2 className="font-heading text-4xl md:text-6xl italic text-text-primary mb-6">Begin Your Legacy</h2>
        <p className="text-text-secondary font-body font-light text-sm md:text-base tracking-wider max-w-2xl mx-auto mb-10">
          Whether you&apos;re seeking your first pied-à-terre in Mayfair or expanding a global property portfolio, 
          our concierge team is ready to craft your bespoke journey.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/concierge"><Button variant="gold" size="lg">CONSULT AN AGENT</Button></Link>
          <Link href="/portfolio"><Button variant="ghost" size="lg">FIND ESTATE</Button></Link>
        </div>
      </AnimateOnScroll>
    </section>
  )
}
