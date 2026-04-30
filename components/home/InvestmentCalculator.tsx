'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

export default function InvestmentCalculator() {
  const [investment, setInvestment] = useState(2000000)
  const [rate, setRate] = useState(7.5)
  const [years, setYears] = useState(10)

  const projectedReturn = Math.round(investment * Math.pow(1 + rate / 100, years))
  const totalGain = projectedReturn - investment

  const mortgageRate = 4.5
  const mortgageTerm = 25
  const loanAmount = investment * 0.7
  const monthlyRate = mortgageRate / 100 / 12
  const totalPayments = mortgageTerm * 12
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <AnimateOnScroll className="text-center mb-12">
          <p className="label-caps text-gold mb-3">Wealth Strategy</p>
          <h2 className="font-heading text-4xl md:text-5xl italic text-text-primary">Investment Calculator</h2>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="grid lg:grid-cols-2 gap-0 bg-surface border border-border">
            {/* Left */}
            <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-border">
              <h3 className="label-caps text-gold mb-8">Property Investment</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="label-caps text-text-muted">Investment Amount</label>
                    <span className="text-gold font-heading text-lg">£{investment.toLocaleString()}</span>
                  </div>
                  <input type="range" min={500000} max={50000000} step={100000} value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full accent-gold h-1 bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="label-caps text-text-muted">Annual Return Rate</label>
                    <span className="text-gold font-heading text-lg">{rate}%</span>
                  </div>
                  <input type="range" min={1} max={20} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-gold h-1 bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="label-caps text-text-muted">Investment Duration</label>
                    <span className="text-gold font-heading text-lg">{years} Years</span>
                  </div>
                  <input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-gold h-1 bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full" />
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="label-caps text-text-muted">Projected Value</span>
                  <span className="text-gold font-heading text-3xl">£{projectedReturn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="label-caps text-text-muted">Total Gain</span>
                  <span className="text-success font-heading text-xl">+£{totalGain.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="p-8 md:p-12">
              <h3 className="label-caps text-gold mb-8">Mortgage Calculator</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="label-caps text-text-muted">Property Value</span>
                  <span className="text-text-primary font-heading text-lg">£{investment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="label-caps text-text-muted">Loan Amount (70% LTV)</span>
                  <span className="text-text-primary font-heading text-lg">£{loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="label-caps text-text-muted">Interest Rate</span>
                  <span className="text-text-primary font-heading text-lg">{mortgageRate}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-border">
                  <span className="label-caps text-text-muted">Term</span>
                  <span className="text-text-primary font-heading text-lg">{mortgageTerm} Years</span>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <span className="label-caps text-text-muted">Monthly Payment</span>
                  <span className="text-gold font-heading text-3xl">£{Math.round(monthlyPayment).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-10">
                <Button variant="gold" fullWidth>SPEAK TO AN ADVISOR</Button>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
