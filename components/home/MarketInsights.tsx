import Image from 'next/image'
import Link from 'next/link'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import { createClient } from '@/lib/supabase/server'

export default async function MarketInsights() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('market_insights')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-charcoal">
      <div className="max-w-[1400px] mx-auto">
        <AnimateOnScroll>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="label-caps text-gold mb-3">Intelligence</p>
              <h2 className="font-heading text-4xl md:text-5xl italic text-text-primary">Market Insights</h2>
            </div>
            <Link href="/market-insights" className="hidden md:flex items-center gap-2 text-xs font-body uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors">
              VIEW ALL INSIGHTS →
            </Link>
          </div>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-3 gap-6">
          {articles?.map((article, i) => (
            <AnimateOnScroll key={article.slug} delay={i * 100}>
              <Link href={`/market-insights/${article.slug}`} className="group block">
                <div className="bg-surface border border-border hover:border-gold/30 transition-all duration-500">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={article.cover_image_url || '/images/hero.png'} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" quality={75} />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <span className="label-caps text-gold bg-obsidian/80 px-3 py-1">{article.category || 'Insight'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg text-text-primary mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-text-muted font-body tracking-wider leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/market-insights" className="inline-flex items-center gap-2 text-xs font-body uppercase tracking-[0.2em] text-gold">VIEW ALL INSIGHTS →</Link>
        </div>
      </div>
    </section>
  )
}
