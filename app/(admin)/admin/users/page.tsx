import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export const revalidate = 0

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (adminProfile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, role, is_verified, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="label-caps text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl italic text-text-primary">User Management</h1>
        </div>

        <div className="bg-surface border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="label-caps text-text-muted text-left px-6 py-4">Name</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Role</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Joined</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Verified</th>
                </tr>
              </thead>
              <tbody>
                {!users || users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-muted font-body">No users found</td>
                  </tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-primary font-body">{u.full_name || 'Anonymous'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={u.role === 'seller' ? 'gold' : u.role === 'admin' ? 'error' : 'outline'}>{u.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted font-body">
                      {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.is_verified ? 'success' : 'outline'}>{u.is_verified ? 'Verified' : 'Pending'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
