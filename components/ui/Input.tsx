'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-[0.7rem] font-body font-medium uppercase tracking-[0.2em] text-text-secondary mb-3"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-surface border border-border px-4 py-3 text-sm text-text-primary font-body font-light tracking-wider',
            'placeholder:text-text-muted',
            'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30',
            'transition-all duration-300',
            error && 'border-error focus:border-error focus:ring-error/30',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error font-body">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
