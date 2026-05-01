import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from('market_insights')
    .select('*, author:profiles(full_name, avatar_url)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !article) {
    notFound()
  }

  // Increment view count
  await supabase.rpc('increment_insight_view_count', { insight_id: article.id }).catch(() => {})

  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] mb-12">
        <Image src={article.cover_image_url || '/images/property-1.png'} alt={article.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
      </div>

      <article className="max-w-[800px] mx-auto px-6 md:px-12 -mt-32 relative z-10">
        {article.category && <span className="label-caps text-gold mb-4 block">{article.category}</span>}
        <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary mb-4">
          {article.title}
        </h1>
        <p className="text-text-muted text-sm font-body tracking-wider mb-10">
          {article.published_at
            ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : ''}
          {article.author?.full_name && ` · By ${article.author.full_name}`}
        </p>

        {article.excerpt && (
          <p className="text-text-secondary font-body font-light text-sm leading-relaxed tracking-wider mb-6 italic border-l-2 border-gold pl-4">
            {article.excerpt}
          </p>
        )}

        <div className="space-y-6">
          {article.content
            ? article.content.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i} className="text-text-secondary font-body font-light text-sm leading-relaxed tracking-wider">
                  {paragraph}
                </p>
              ))
            : <p className="text-text-muted font-body tracking-wider">Content coming soon.</p>}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <Link href="/market-insights" className="text-xs font-body uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors">
            ← Back to Market Insights
          </Link>
        </div>
      </article>
    </div>
  )
}
