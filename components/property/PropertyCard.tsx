'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { cn, formatPriceRaw } from '@/lib/utils'
import type { PropertyCardProps } from '@/types'

export default function PropertyCard({
  id,
  title,
  location,
  price,
  pricePerWeek,
  listingType,
  bedrooms,
  sqFt,
  coverImage,
  neighborhoodBadge,
  isGradeListed,
  gradeListing,
  isSaved = false,
  onSaveToggle,
}: PropertyCardProps) {
  const badgeLabel = listingType === 'sale' ? 'FOR SALE' : listingType === 'rent' ? 'TO RENT' : 'OFF MARKET'
  const badgeVariant = listingType === 'off_market' ? 'gold' : 'dark'

  return (
    <Link href={`/portfolio/${id}`} className="group block">
      <div className="relative overflow-hidden bg-surface border border-border hover:border-gold/30 transition-all duration-500">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
            {neighborhoodBadge && (
              <Badge variant="dark">{neighborhoodBadge}</Badge>
            )}
          </div>

          {/* Save Button */}
          {onSaveToggle && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onSaveToggle()
              }}
              className={cn(
                'absolute top-4 right-4 p-2 transition-all duration-300',
                isSaved ? 'text-gold' : 'text-white/60 hover:text-gold'
              )}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-heading text-lg text-text-primary mb-1 group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-text-muted font-body tracking-wider mb-3">
            {bedrooms && <span>{bedrooms} Bedrooms</span>}
            {sqFt && (
              <>
                <span className="text-border">·</span>
                <span>{sqFt.toLocaleString()} sq. ft</span>
              </>
            )}
            {isGradeListed && gradeListing && (
              <>
                <span className="text-border">·</span>
                <span>{gradeListing}</span>
              </>
            )}
          </div>
          <p className="text-xs text-text-secondary font-body tracking-wider mb-3">{location}</p>
          <p className="text-gold font-heading text-xl">
            {listingType === 'rent' && pricePerWeek
              ? `£${pricePerWeek.toLocaleString()} / pw`
              : formatPriceRaw(price)
            }
          </p>
        </div>
      </div>
    </Link>
  )
}
