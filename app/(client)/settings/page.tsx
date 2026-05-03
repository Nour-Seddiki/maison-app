import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export const revalidate = 0

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-12">
          <p className="label-caps text-gold mb-2">Account</p>
          <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary">Settings</h1>
        </div>
        <SettingsClient />
      </div>
    </div>
  )
}
