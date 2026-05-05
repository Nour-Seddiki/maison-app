import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin: requestOrigin } = new URL(request.url)
  const forwardedHost = (request as Request & { headers: Headers }).headers.get('x-forwarded-host')
  const protocol = (request as Request & { headers: Headers }).headers.get('x-forwarded-proto') ?? 'https'
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (forwardedHost ? `${protocol}://${forwardedHost}` : requestOrigin)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get user role to determine redirect
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = profile?.role || user.user_metadata?.role
        if (role === 'seller' || role === 'admin') {
          return NextResponse.redirect(`${origin}/seller/dashboard`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth error — redirect to sign in with error
  return NextResponse.redirect(`${origin}/signin?error=auth_callback_failed`)
}
