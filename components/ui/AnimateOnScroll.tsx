'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: 'fade-up' | 'fade-in' | 'fade-right'
}

export default function AnimateOnScroll({ 
  children, 
  className, 
  delay = 0,
  animation = 'fade-up' 
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        !isVisible && animation === 'fade-up' && 'opacity-0 translate-y-6',
        !isVisible && animation === 'fade-in' && 'opacity-0',
        !isVisible && animation === 'fade-right' && 'opacity-0 translate-x-12',
        isVisible && 'opacity-100 translate-y-0 translate-x-0',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
