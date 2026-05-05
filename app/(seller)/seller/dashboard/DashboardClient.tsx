'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { BarChart3, Eye, MessageSquare, Clock, Plus, Edit, Trash2, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardClientProps {
  stats: any[]
  listings: any[]
  recentInquiries: any[]
  viewingAppointments: any[]
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'pending_review': return 'gold'
    case 'draft': return 'outline'
    case 'new': return 'gold'
    case 'contacted': return 'outline'
    case 'viewing_scheduled': return 'success'
    default: return 'dark'
  }
}

const statusLabel = (status: string) => status.replace('_', ' ')

const iconMap: Record<string, any> = {
  'Active Listings': BarChart3,
  'Total Inquiries': MessageSquare,
  'Views This Month': Eye,
  'Pending Reviews': Clock,
}

export default function DashboardClient({ stats, listings, recentInquiries, viewingAppointments }: DashboardClientProps) {
  const router = useRouter()
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(true)
    setDeleteError(null)
    const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setDeleteError(data.error || 'Failed to delete')
      setDeleting(false)
      return
    }
    setConfirm(null)
    setDeleting(false)
    router.refresh()
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border p-8 max-w-sm w-full mx-4">
            <h3 className="font-heading text-xl italic text-text-primary mb-2">Delete Property</h3>
            <p className="text-sm text-text-secondary font-body mb-2">
              Permanently delete &ldquo;{confirm.title}&rdquo;? This cannot be undone.
            </p>
            {deleteError && <p className="text-xs text-red-400 font-body mb-3">{deleteError}</p>}
            <div className="flex gap-3 mt-4">
              <Button variant="dark" size="sm" onClick={() => handleDelete(confirm.id)} disabled={deleting}>
                {deleting ? '...' : 'Delete'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setConfirm(null); setDeleteError(null) }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="label-caps text-gold mb-2">Seller Portal</p>
            <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary">Your Portfolio</h1>
          </div>
          <Link href="/seller/listings/new">
            <Button variant="gold"><Plus size={14} className="mr-2" /> NEW LISTING</Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.label] || BarChart3
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-surface border border-border p-6"
              >
                <Icon size={20} className="text-gold mb-4" />
                <p className="font-heading text-3xl text-text-primary">{stat.value}</p>
                <p className="label-caps text-text-muted mt-2">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Listings Table */}
        <div className="bg-surface border border-border mb-12">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-heading text-xl text-text-primary">Your Listings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="label-caps text-text-muted text-left px-6 py-3">Property</th>
                  <th className="label-caps text-text-muted text-left px-6 py-3">Status</th>
                  <th className="label-caps text-text-muted text-left px-6 py-3">Price</th>
                  <th className="label-caps text-text-muted text-left px-6 py-3">Views</th>
                  <th className="label-caps text-text-muted text-right px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-muted font-body">No properties listed yet</td>
                  </tr>
                )}
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-2 overflow-hidden flex-shrink-0">
                          {listing.cover_image_url ? (
                            <img src={listing.cover_image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-border" />
                          )}
                        </div>
                        <span className="text-sm text-text-primary font-body">{listing.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(listing.status) as 'gold' | 'success' | 'outline' | 'dark'}>{statusLabel(listing.status)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gold text-sm font-heading">
                      £{listing.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{listing.view_count?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/seller/listings/${listing.id}/edit`} className="p-2 text-text-muted hover:text-gold transition-colors">
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => setConfirm({ id: listing.id, title: listing.title })}
                          className="p-2 text-text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Viewing Appointments */}
        <div className="bg-surface border border-border mb-12">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <CalendarDays size={18} className="text-gold" />
            <h3 className="font-heading text-xl text-text-primary">Viewing Appointments</h3>
          </div>
          <div className="divide-y divide-border">
            {viewingAppointments.length === 0 && (
              <div className="px-6 py-8 text-center text-text-muted font-body">No viewing requests yet</div>
            )}
            {viewingAppointments.map((appt, i) => (
              <div key={appt.id || i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-surface-2/50 transition-colors">
                <div>
                  <p className="text-sm text-text-primary font-body font-medium">{appt.contact_name}</p>
                  <p className="text-xs text-text-muted font-body tracking-wider mt-0.5">{appt.properties?.title || 'Unknown Property'}</p>
                  {appt.contact_email && (
                    <p className="text-xs text-text-muted font-body tracking-wider">{appt.contact_email}{appt.contact_phone ? ` · ${appt.contact_phone}` : ''}</p>
                  )}
                  {appt.message && (
                    <p className="text-xs text-text-secondary font-body tracking-wider mt-1 italic">&ldquo;{appt.message}&rdquo;</p>
                  )}
                </div>
                <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                  {appt.preferred_viewing_date && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body tracking-wider">
                      <CalendarDays size={12} />
                      {new Date(appt.preferred_viewing_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  <Badge variant={statusVariant(appt.status) as 'gold' | 'success' | 'outline' | 'dark'}>{statusLabel(appt.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-surface border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-heading text-xl text-text-primary">Recent Inquiries</h3>
          </div>
          <div className="divide-y divide-border">
            {recentInquiries.length === 0 && (
              <div className="px-6 py-8 text-center text-text-muted font-body">No recent inquiries</div>
            )}
            {recentInquiries.map((inquiry, i) => (
              <div key={inquiry.id || i} className="px-6 py-4 flex items-center justify-between hover:bg-surface-2/50 transition-colors">
                <div>
                  <p className="text-sm text-text-primary font-body">{inquiry.contact_name}</p>
                  <p className="text-xs text-text-muted font-body tracking-wider mt-1">{inquiry.properties?.title || 'Unknown Property'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted font-body tracking-wider">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                  <Badge variant={statusVariant(inquiry.status) as 'gold' | 'success' | 'outline' | 'dark'}>{statusLabel(inquiry.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
