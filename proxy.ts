import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set(name, value)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set(name, value, options as Record<string, string>)
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set(name, '')
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set(name, '', options as Record<string, string>)
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Redirect unauthenticated users from protected routes
  if (!user && (
    path.startsWith('/dashboard') ||
    path.startsWith('/seller') ||
    path.startsWith('/admin') ||
    path.startsWith('/profile')
  )) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Role-based protection
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (path.startsWith('/seller') && role !== 'seller' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/seller/:path*',
    '/admin/:path*',
    '/private-sales/:path*',
  ],
}
