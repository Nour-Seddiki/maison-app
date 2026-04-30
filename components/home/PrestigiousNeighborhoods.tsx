import Image from 'next/image'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

const neighborhoods = [
  { name: 'London', image: '/images/property-1.png' },
  { name: 'New York', image: '/images/property-2.png' },
  { name: 'Paris', image: '/images/property-3.png' },
  { name: 'Dubai', image: '/images/hero.png' },
]

export default function PrestigiousNeighborhoods() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <AnimateOnScroll className="text-center mb-12">
          <p className="label-caps text-gold mb-3">Global Presence</p>
          <h2 className="font-heading text-4xl md:text-5xl italic text-text-primary">Prestigious Neighborhoods</h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {neighborhoods.map((city, i) => (
            <AnimateOnScroll key={city.name} delay={i * 100}>
              <div className="group relative aspect-[3/4] overflow-hidden cursor-pointer">
                <Image src={city.image} alt={city.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" quality={75} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-heading text-2xl md:text-3xl text-white">{city.name}</h3>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
