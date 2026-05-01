import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export default async function MarketInsightsPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('market_insights')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="label-caps text-gold mb-3">Intelligence</p>
          <h1 className="font-heading text-5xl md:text-7xl italic text-text-primary mb-4">Market Insights</h1>
          <p className="text-text-secondary font-body font-light text-sm tracking-wider max-w-xl mx-auto">
            Expert analysis, market intelligence, and editorial commentary from our research team.
          </p>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-text-muted font-body tracking-wider">No insights published yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.slug} href={`/market-insights/${article.slug}`} className="group block">
                <div className="bg-surface border border-border hover:border-gold/30 transition-all duration-500">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={article.cover_image_url || '/images/property-1.png'} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <span className="label-caps text-gold bg-obsidian/80 px-3 py-1">{article.category || 'Insight'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    {article.published_at && (
                      <p className="text-xs text-text-muted font-body tracking-wider mb-2">
                        {new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                    <h3 className="font-heading text-lg text-text-primary mb-3 group-hover:text-gold transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-text-muted font-body tracking-wider leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
