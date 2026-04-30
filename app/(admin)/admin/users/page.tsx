'use client'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'

const users = [
  { id: '1', name: 'Victoria Ashworth', email: 'v.ashworth@email.com', role: 'client', joined: 'Apr 28, 2024', verified: true },
  { id: '2', name: 'James Morrison', email: 'j.morrison@agency.com', role: 'seller', joined: 'Apr 27, 2024', verified: true },
  { id: '3', name: 'Sophia Beaumont', email: 's.beaumont@email.com', role: 'client', joined: 'Apr 26, 2024', verified: false },
  { id: '4', name: 'Alexander Chen', email: 'a.chen@estate.com', role: 'seller', joined: 'Apr 25, 2024', verified: true },
  { id: '5', name: 'Isabella Romano', email: 'i.romano@email.com', role: 'client', joined: 'Apr 24, 2024', verified: false },
  { id: '6', name: 'William Sterling', email: 'w.sterling@luxury.com', role: 'seller', joined: 'Apr 23, 2024', verified: false },
]

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="label-caps text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl italic text-text-primary">User Management</h1>
        </motion.div>

        <div className="bg-surface border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="label-caps text-text-muted text-left px-6 py-4">Name</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Email</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Role</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Joined</th>
                  <th className="label-caps text-text-muted text-left px-6 py-4">Verified</th>
                  <th className="label-caps text-text-muted text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-primary font-body">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-body">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'seller' ? 'gold' : user.role === 'admin' ? 'error' : 'outline'}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted font-body">{user.joined}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.verified ? 'success' : 'outline'}>{user.verified ? 'Verified' : 'Pending'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="dark" size="sm">Manage</Button>
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
