import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import AboutSection from '@/components/home/AboutSection'
import ExceptionalResidences from '@/components/home/ExceptionalResidences'
import VirtualMasterpieces from '@/components/home/VirtualMasterpieces'
import PrestigiousNeighborhoods from '@/components/home/PrestigiousNeighborhoods'
import Testimonials from '@/components/home/Testimonials'
import BeginLegacy from '@/components/home/BeginLegacy'

function ResidencesSkeleton() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="h-8 w-48 bg-surface-2 mb-3 animate-pulse" />
        <div className="h-12 w-72 bg-surface-2 mb-12 animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-surface border border-border">
              <div className="aspect-[4/3] bg-surface-2 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 bg-surface-2 animate-pulse" />
                <div className="h-4 w-1/2 bg-surface-2 animate-pulse" />
                <div className="h-6 w-1/3 bg-surface-2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Suspense fallback={<ResidencesSkeleton />}>
        <ExceptionalResidences />
      </Suspense>
      <VirtualMasterpieces />
      <PrestigiousNeighborhoods />
      <Testimonials />
      <BeginLegacy />
    </>
  )
}
