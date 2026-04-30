import Hero from '@/components/home/Hero'
import ExceptionalResidences from '@/components/home/ExceptionalResidences'
import VirtualMasterpieces from '@/components/home/VirtualMasterpieces'
import PrestigiousNeighborhoods from '@/components/home/PrestigiousNeighborhoods'
import InvestmentCalculator from '@/components/home/InvestmentCalculator'
import Testimonials from '@/components/home/Testimonials'
import EstateConcierges from '@/components/home/EstateConcierges'
import BeginLegacy from '@/components/home/BeginLegacy'
import MarketInsights from '@/components/home/MarketInsights'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExceptionalResidences />
      <VirtualMasterpieces />
      <PrestigiousNeighborhoods />
      <InvestmentCalculator />
      <Testimonials />
      <EstateConcierges />
      <BeginLegacy />
      <MarketInsights />
    </>
  )
}
