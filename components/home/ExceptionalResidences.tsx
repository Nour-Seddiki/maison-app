import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/server'
import { Property } from '@/types'

function PropertyCardStatic({ property }: { property: Property }) {
  const location = property.neighborhood ? `${property.neighborhood.name}, ${property.city}` : property.city;
  const neighborhoodBadge = property.neighborhood?.name;
  
  return (
    <Link href={`/portfolio/${property.id}`} className="group block">
      <div className="relative overflow-hidden bg-surface border border-border hover:border-gold/30 transition-all duration-500">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={property.cover_image_url || '/images/hero.png'} alt={property.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="dark">{property.listing_type === 'sale' ? 'FOR SALE' : 'FOR RENT'}</Badge>
            {neighborhoodBadge && <Badge variant="dark">{neighborhoodBadge}</Badge>}
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-heading text-lg text-text-primary mb-1 group-hover:text-gold transition-colors duration-300">{property.title}</h3>
          <div className="flex items-center gap-2 text-xs text-text-muted font-body tracking-wider mb-3">
            {property.bedrooms && <span>{property.bedrooms} Bedrooms</span>}
            {property.sq_ft && <><span className="text-border">·</span><span>{property.sq_ft.toLocaleString()} sq. ft</span></>}
            {property.is_grade_listed && property.grade_listing && <><span className="text-border">·</span><span>{property.grade_listing}</span></>}
          </div>
          <p className="text-xs text-text-secondary font-body tracking-wider mb-3">{location}</p>
          <p className="text-gold font-heading text-xl">£{property.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  )
}

export default async function ExceptionalResidences() {
  const supabase = await createClient()
  const { data: featuredProperties } = await supabase
    .from('properties')
    .select('*, neighborhood:neighborhoods(*)')
    .eq('is_featured', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <AnimateOnScroll>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="label-caps text-gold mb-3">Curated Selection</p>
              <h2 className="font-heading text-4xl md:text-5xl italic text-text-primary">Exceptional Residences</h2>
            </div>
            <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-xs font-body uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors">
              VIEW ALL LISTINGS →
            </Link>
          </div>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties?.map((property, i) => (
            <AnimateOnScroll key={property.id} delay={i * 100}>
              <PropertyCardStatic property={property as unknown as Property} />
            </AnimateOnScroll>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-xs font-body uppercase tracking-[0.2em] text-gold">
            VIEW ALL LISTINGS →
          </Link>
        </div>
      </div>
    </section>
  )
}
