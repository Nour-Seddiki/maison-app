import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from '../ProfileClient'

export const revalidate = 0

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/signin')

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-12">
          <p className="label-caps text-gold mb-2">Account</p>
          <h1 className="font-heading text-4xl italic text-text-primary">Edit Profile</h1>
        </div>
        <ProfileClient profile={profile} />
      </div>
    </div>
  )
}
