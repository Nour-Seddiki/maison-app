'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const articles = [
  { slug: 'london-property-q1-2024', title: 'London Prime Property: Q1 2024 Market Overview', excerpt: 'An in-depth analysis of price movements across PCL, emerging neighborhoods, and buyer sentiment.', category: 'Market Analysis', image: '/images/property-1.png', date: 'April 15, 2024' },
  { slug: 'architecture-of-tomorrow', title: 'The Architecture of Tomorrow: Sustainable Luxury', excerpt: 'How the world\'s leading architects are redefining opulence through environmental consciousness.', category: 'Architecture', image: '/images/property-2.png', date: 'April 10, 2024' },
  { slug: 'global-wealth-migration', title: 'Global Wealth Migration & Prime Real Estate', excerpt: 'Understanding how shifting UHNW demographics reshape London\'s exclusive property markets.', category: 'Investment', image: '/images/property-3.png', date: 'April 5, 2024' },
  { slug: 'heritage-modernism', title: 'Where Heritage Meets Modernism', excerpt: 'The delicate art of blending period architecture with contemporary interior design.', category: 'Design', image: '/images/hero.png', date: 'March 28, 2024' },
  { slug: 'private-garden-squares', title: 'London\'s Private Garden Squares', excerpt: 'An exclusive look at the city\'s hidden green sanctuaries and the properties that surround them.', category: 'Lifestyle', image: '/images/library.png', date: 'March 20, 2024' },
  { slug: 'art-of-negotiation', title: 'The Art of Negotiation in Prime Real Estate', excerpt: 'Expert strategies for securing the finest properties in the world\'s most competitive markets.', category: 'Advisory', image: '/images/property-1.png', date: 'March 15, 2024' },
]

export default function MarketInsightsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="label-caps text-gold mb-3">Intelligence</p>
          <h1 className="font-heading text-5xl md:text-7xl italic text-text-primary mb-4">Market Insights</h1>
          <p className="text-text-secondary font-body font-light text-sm tracking-wider max-w-xl mx-auto">
            Expert analysis, market intelligence, and editorial commentary from our research team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.div key={article.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/market-insights/${article.slug}`} className="group block">
                <div className="bg-surface border border-border hover:border-gold/30 transition-all duration-500">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <span className="label-caps text-gold bg-obsidian/80 px-3 py-1">{article.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-text-muted font-body tracking-wider mb-2">{article.date}</p>
                    <h3 className="font-heading text-lg text-text-primary mb-3 group-hover:text-gold transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-text-muted font-body tracking-wider leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
