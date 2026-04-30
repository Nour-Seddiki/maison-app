import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'gold' | 'dark' | 'success' | 'error' | 'outline'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'dark', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-[0.6rem] font-body font-medium uppercase tracking-[0.2em]',
        variant === 'gold' && 'bg-gold/20 text-gold border border-gold/30',
        variant === 'dark' && 'bg-obsidian/80 text-text-secondary border border-border',
        variant === 'success' && 'bg-success/20 text-success border border-success/30',
        variant === 'error' && 'bg-error/20 text-error border border-error/30',
        variant === 'outline' && 'bg-transparent text-text-secondary border border-border',
        className
      )}
    >
      {children}
    </span>
  )
}
