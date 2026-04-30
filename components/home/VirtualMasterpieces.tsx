import Image from 'next/image'
import Button from '@/components/ui/Button'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

export default function VirtualMasterpieces() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <Image src="/images/library.png" alt="Virtual masterpieces" fill sizes="100vw" className="object-cover" quality={80} />
      <div className="absolute inset-0 bg-black/60" />
      <AnimateOnScroll className="relative z-10 text-center px-6">
        <p className="label-caps text-gold mb-4">Virtual Experience</p>
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl italic text-white mb-6">Virtual Masterpieces</h2>
        <p className="text-text-secondary font-body font-light text-sm md:text-base tracking-wider max-w-lg mx-auto mb-10">
          Immerse yourself in breathtaking virtual tours of the world&apos;s most extraordinary residences, 
          from the comfort of your current home.
        </p>
        <Button variant="ghost" size="lg">ENTER MAISON</Button>
      </AnimateOnScroll>
    </section>
  )
}
