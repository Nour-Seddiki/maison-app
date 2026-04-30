// Server component — no hooks or browser APIs used

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gold', size = 'md', fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-body font-medium tracking-[0.2em] uppercase transition-all duration-300',
          // Variants
          variant === 'gold' && 'bg-gold text-obsidian hover:bg-gold-light active:bg-gold-dim',
          variant === 'ghost' && 'border border-gold text-gold hover:bg-gold/10 active:bg-gold/20',
          variant === 'dark' && 'bg-surface-2 text-text-primary border border-border hover:bg-surface hover:border-gold/30',
          // Sizes
          size === 'sm' && 'px-4 py-2 text-[0.65rem]',
          size === 'md' && 'px-8 py-3 text-[0.7rem]',
          size === 'lg' && 'px-12 py-4 text-[0.75rem]',
          // Width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
