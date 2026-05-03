'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Trash2 } from 'lucide-react'

interface ListingRow {
  id: string
  title: string
  price: number | null
  status: string
  view_count: number | null
  created_at: string
  seller: { full_name: string | null } | null
}

export default function AdminListingsClient({ listings }: { listings: ListingRow[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null)

  async function handleDelete(id: string) {
    setLoading(id)
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
    setLoading(null)
    setConfirm(null)
    router.refresh()
  }

  async function handleStatus(id: string, status: string) {
    setLoading(id + '_status')
    await fetch(`/api/admin/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <>
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border p-8 max-w-sm w-full mx-4">
            <h3 className="font-heading text-xl italic text-text-primary mb-2">Delete Property</h3>
            <p className="text-sm text-text-secondary font-body mb-6">
              Permanently delete &ldquo;{confirm.title}&rdquo;? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="dark"
                size="sm"
                onClick={() => handleDelete(confirm.id)}
                disabled={!!loading}
              >
                {loading === confirm.id ? '...' : 'Delete'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirm(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="label-caps text-text-muted text-left px-6 py-4">Property</th>
              <th className="label-caps text-text-muted text-left px-6 py-4">Seller</th>
              <th className="label-caps text-text-muted text-left px-6 py-4">Status</th>
              <th className="label-caps text-text-muted text-left px-6 py-4">Price</th>
              <th className="label-caps text-text-muted text-left px-6 py-4">Views</th>
              <th className="label-caps text-text-muted text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-muted font-body">No listings yet</td>
              </tr>
            ) : listings.map((listing) => (
              <tr key={listing.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                <td className="px-6 py-4 text-sm text-text-primary font-body">{listing.title}</td>
                <td className="px-6 py-4 text-sm text-text-secondary font-body">{listing.seller?.full_name || '—'}</td>
                <td className="px-6 py-4">
                  <Badge variant={listing.status === 'active' ? 'success' : listing.status === 'pending_review' ? 'gold' : 'outline'}>
                    {listing.status.replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gold text-sm font-heading">£{listing.price?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-text-secondary font-body">{(listing.view_count || 0).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {listing.status === 'pending_review' && (
                      <button
                        onClick={() => handleStatus(listing.id, 'active')}
                        disabled={!!loading}
                        className="px-3 py-1.5 text-[0.65rem] font-body uppercase tracking-[0.15em] text-gold border border-gold/40 hover:bg-gold/10 transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {listing.status === 'active' && (
                      <button
                        onClick={() => handleStatus(listing.id, 'off_market')}
                        disabled={!!loading}
                        className="px-3 py-1.5 text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted border border-border hover:text-gold/70 hover:border-gold/30 transition-colors disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    )}
                    {listing.status !== 'pending_review' && listing.status !== 'active' && (
                      <button
                        onClick={() => handleStatus(listing.id, 'active')}
                        disabled={!!loading}
                        className="px-3 py-1.5 text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted border border-border hover:text-gold/70 hover:border-gold/30 transition-colors disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => setConfirm({ id: listing.id, title: listing.title })}
                      disabled={!!loading}
                      className="flex items-center gap-1 px-3 py-1.5 text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted border border-border hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
