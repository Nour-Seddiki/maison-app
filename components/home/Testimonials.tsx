import { Star } from 'lucide-react'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

const testimonials = [
  {
    rating: 5,
    quote: "Maison & Co. transformed our property search into an exquisite journey. Their intimate knowledge of London's most exclusive addresses is simply unmatched.",
    name: 'Victoria Ashworth',
    location: 'Mayfair, London',
  },
  {
    rating: 5,
    quote: "The level of discretion and personalised service provided by the team exceeded every expectation. They found our family a home that tells our story.",
    name: 'Alexander Chen',
    location: 'Knightsbridge, London',
  },
  {
    rating: 5,
    quote: "From the initial consultation to the final exchange, every interaction was conducted with the utmost professionalism. A truly white-glove experience.",
    name: 'Sophia Beaumont',
    location: 'Chelsea, London',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-charcoal">
      <div className="max-w-[1400px] mx-auto">
        <AnimateOnScroll className="text-center mb-16">
          <p className="label-caps text-gold mb-3">Client Voices</p>
          <h2 className="font-heading text-4xl md:text-5xl italic text-text-primary">Testimonials</h2>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={i} delay={i * 100}>
              <div className="bg-surface border border-border p-8 flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary font-body font-light leading-relaxed tracking-wider flex-1 mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-text-primary font-body font-medium">{t.name}</p>
                  <p className="text-xs text-text-muted font-body tracking-wider mt-1">{t.location}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
