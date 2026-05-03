'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Trash2, Ban, CheckCircle } from 'lucide-react'

interface UserRow {
  id: string
  full_name: string | null
  role: string
  is_verified: boolean
  is_banned: boolean | null
  created_at: string
}

export default function AdminUsersClient({ users }: { users: UserRow[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ type: 'delete' | 'ban' | 'unban'; id: string; name: string } | null>(null)

  async function handleDelete(id: string) {
    setLoading(id + '_delete')
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: id }),
    })
    setLoading(null)
    setConfirm(null)
    router.refresh()
  }

  async function handleBan(id: string, ban: boolean) {
    setLoading(id + '_ban')
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: id, is_banned: ban }),
    })
    setLoading(null)
    setConfirm(null)
    router.refresh()
  }

  return (
    <>
      {/* Confirmation dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border p-8 max-w-sm w-full mx-4">
            <h3 className="font-heading text-xl italic text-text-primary mb-2">
              {confirm.type === 'delete' ? 'Delete User' : confirm.type === 'ban' ? 'Ban User' : 'Unban User'}
            </h3>
            <p className="text-sm text-text-secondary font-body mb-6">
              {confirm.type === 'delete'
                ? `Permanently delete "${confirm.name}"? This cannot be undone.`
                : confirm.type === 'ban'
                ? `Ban "${confirm.name}"? They will be unable to access the platform.`
                : `Unban "${confirm.name}"? They will regain access.`}
            </p>
            <div className="flex gap-3">
              <Button
                variant={confirm.type === 'delete' ? 'dark' : 'gold'}
                size="sm"
                onClick={() => confirm.type === 'delete'
                  ? handleDelete(confirm.id)
                  : handleBan(confirm.id, confirm.type === 'ban')}
                disabled={!!loading}
              >
                {loading ? '...' : 'Confirm'}
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
              <th className="label-caps text-text-muted text-left px-6 py-4">Name</th>
              <th className="label-caps text-text-muted text-left px-6 py-4">Role</th>
              <th className="label-caps text-text-muted text-left px-6 py-4">Joined</th>
              <th className="label-caps text-text-muted text-left px-6 py-4">Status</th>
              <th className="label-caps text-text-muted text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-muted font-body">No users found</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm text-text-primary font-body">{u.full_name || 'Anonymous'}</p>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={u.role === 'seller' ? 'gold' : u.role === 'admin' ? 'error' : 'outline'}>{u.role}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted font-body">
                  {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  {u.is_banned
                    ? <Badge variant="error">Banned</Badge>
                    : <Badge variant={u.is_verified ? 'success' : 'outline'}>{u.is_verified ? 'Verified' : 'Active'}</Badge>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {u.is_banned ? (
                      <button
                        onClick={() => setConfirm({ type: 'unban', id: u.id, name: u.full_name || 'User' })}
                        disabled={!!loading}
                        className="flex items-center gap-1 px-3 py-1.5 text-[0.65rem] font-body uppercase tracking-[0.15em] text-gold border border-gold/40 hover:bg-gold/10 transition-colors disabled:opacity-50"
                        title="Unban user"
                      >
                        <CheckCircle size={11} />
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirm({ type: 'ban', id: u.id, name: u.full_name || 'User' })}
                        disabled={!!loading || u.role === 'admin'}
                        className="flex items-center gap-1 px-3 py-1.5 text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted border border-border hover:text-gold/70 hover:border-gold/30 transition-colors disabled:opacity-30"
                        title={u.role === 'admin' ? 'Cannot ban admin' : 'Ban user'}
                      >
                        <Ban size={11} />
                        Ban
                      </button>
                    )}
                    <button
                      onClick={() => setConfirm({ type: 'delete', id: u.id, name: u.full_name || 'User' })}
                      disabled={!!loading || u.role === 'admin'}
                      className="flex items-center gap-1 px-3 py-1.5 text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted border border-border hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-30"
                      title={u.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
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
