import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'
import Link from 'next/link'
import { Mail, Phone, Globe, Wallet, MapPin, Edit3, CheckCircle } from 'lucide-react'

export const revalidate = 0

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/signin')

  const infoCards = [
    { label: 'Email', value: user.email, icon: Mail },
    { label: 'Phone', value: profile.phone || null, icon: Phone },
    { label: 'Nationality', value: profile.nationality || null, icon: Globe },
    { label: 'Currency', value: profile.preferred_currency || null, icon: Wallet },
    { label: 'Location', value: profile.location || null, icon: MapPin },
  ].filter(c => c.value)

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="label-caps text-gold mb-2">Account</p>
          <h1 className="font-heading text-4xl md:text-5xl italic text-text-primary">Your Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-surface border border-border mb-8">

          {/* Gold accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start gap-8">

              {/* Avatar column */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-surface-2 border border-border overflow-hidden flex items-center justify-center">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-heading text-3xl md:text-4xl text-gold italic">
                      {(profile.display_name || profile.full_name || user.email || 'A')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                {profile.is_verified && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-gold" />
                    <span className="label-caps text-gold text-[0.6rem]">Verified</span>
                  </div>
                )}
                <span className="label-caps text-text-muted text-[0.6rem]">{profile.role}</span>
              </div>

              {/* Info column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl italic text-text-primary leading-tight">
                      {profile.display_name || profile.full_name || 'Anonymous Member'}
                    </h2>
                    {profile.full_name && profile.display_name && profile.full_name !== profile.display_name && (
                      <p className="text-xs text-text-muted font-body tracking-wider mt-0.5">{profile.full_name}</p>
                    )}
                  </div>
                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-2 px-4 py-2 text-[0.65rem] font-body uppercase tracking-[0.15em] text-text-muted border border-border hover:text-gold hover:border-gold/40 transition-colors flex-shrink-0"
                  >
                    <Edit3 size={11} />
                    Edit
                  </Link>
                </div>

                {profile.bio ? (
                  <p className="text-sm text-text-secondary font-body leading-relaxed mb-6 max-w-xl">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted font-body italic mb-6">No bio added yet.</p>
                )}

                {/* Info grid */}
                {infoCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {infoCards.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-surface-2 border border-border px-4 py-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-5 h-5 flex items-center justify-center bg-gold/10">
                            <Icon size={10} className="text-gold" />
                          </div>
                          <span className="label-caps text-text-muted text-[0.6rem]">{label}</span>
                        </div>
                        <p className="text-sm font-body text-text-primary truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-surface border border-border">
          <div className="px-6 md:px-8 py-5 border-b border-border">
            <h3 className="font-heading text-xl italic text-text-primary">Edit Profile</h3>
          </div>
          <div className="px-6 md:px-8 py-6">
            <ProfileClient profile={profile} />
          </div>
        </div>

      </div>
    </div>
  )
}
