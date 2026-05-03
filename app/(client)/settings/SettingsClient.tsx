'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { Lock, Trash2, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react'

export default function SettingsClient() {
  const router = useRouter()

  // Change Password
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Delete Account
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Privacy
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [profileVisible, setProfileVisible] = useState(true)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg(null)
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    if (newPw.length < 8) {
      setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    setPwLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwLoading(false)
    if (error) {
      setPwMsg({ type: 'error', text: error.message })
    } else {
      setPwMsg({ type: 'success', text: 'Password updated successfully.' })
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeleteLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    await fetch('/api/account', { method: 'DELETE' })
    setDeleteLoading(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="space-y-8">

      {/* Change Password */}
      <section className="bg-surface border border-border">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-gold/10">
            <Lock size={14} className="text-gold" />
          </div>
          <h2 className="font-heading text-xl italic text-text-primary">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="px-6 py-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label-caps text-text-muted mb-2 block">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-surface-2 border border-border px-4 py-3 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label-caps text-text-muted mb-2 block">Confirm New Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-surface-2 border border-border px-4 py-3 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>
          {pwMsg && (
            <p className={`text-xs font-body ${pwMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {pwMsg.text}
            </p>
          )}
          <div className="flex justify-end pt-1">
            <Button type="submit" variant="gold" size="sm" disabled={pwLoading}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </section>

      {/* Privacy */}
      <section className="bg-surface border border-border">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-gold/10">
            <ShieldCheck size={14} className="text-gold" />
          </div>
          <h2 className="font-heading text-xl italic text-text-primary">Privacy</h2>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-body text-text-primary">Profile Visibility</p>
              <p className="text-xs font-body text-text-muted mt-0.5">Allow other members to view your profile</p>
            </div>
            <button
              onClick={() => setProfileVisible(!profileVisible)}
              className={`relative w-10 h-5 transition-colors ${profileVisible ? 'bg-gold' : 'bg-surface-2 border border-border'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-obsidian transition-transform ${profileVisible ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-body text-text-primary">Marketing Communications</p>
              <p className="text-xs font-body text-text-muted mt-0.5">Receive market insights and property alerts</p>
            </div>
            <button
              onClick={() => setMarketingEmails(!marketingEmails)}
              className={`relative w-10 h-5 transition-colors ${marketingEmails ? 'bg-gold' : 'bg-surface-2 border border-border'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-obsidian transition-transform ${marketingEmails ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Delete Account */}
      <section className="bg-surface border border-red-900/30">
        <div className="px-6 py-5 border-b border-red-900/30 flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-red-900/20">
            <AlertTriangle size={14} className="text-red-400" />
          </div>
          <h2 className="font-heading text-xl italic text-text-primary">Danger Zone</h2>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm font-body text-text-secondary mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="dark"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="border-red-900/50 text-red-400 hover:bg-red-900/20"
          >
            <Trash2 size={13} className="mr-2" />
            Delete My Account
          </Button>
        </div>
      </section>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border p-8 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
              <h3 className="font-heading text-xl italic text-text-primary">Delete Account</h3>
            </div>
            <p className="text-sm text-text-secondary font-body mb-2">
              This will permanently delete your account, profile, and all data. To confirm, type <span className="text-red-400 font-medium">DELETE</span> below.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full bg-surface-2 border border-border px-4 py-3 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-900/50 mt-4 mb-6"
            />
            <div className="flex gap-3">
              <Button
                variant="dark"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                className="border-red-900/50 text-red-400 hover:bg-red-900/20 disabled:opacity-30"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowDeleteModal(false); setDeleteConfirm('') }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
