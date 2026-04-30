'use client'

import { cn } from '@/lib/utils'
import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg bg-surface border border-border p-8 animate-scale-in',
          className
        )}
      >
        {/* Header */}
        {(title) && (
          <div className="flex items-center justify-between mb-6">
            {title && (
              <h3 className="text-xl font-heading font-light text-text-primary">{title}</h3>
            )}
            <button
              onClick={onClose}
              className="text-text-muted hover:text-gold transition-colors ml-auto"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-gold transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {children}
      </div>
    </div>
  )
}
