import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  const adminDb = createAdminClient()

  // Ensure the avatars bucket exists
  const { data: buckets } = await adminDb.storage.listBuckets()
  const bucketExists = buckets?.some((b) => b.name === 'avatars')
  if (!bucketExists) {
    await adminDb.storage.createBucket('avatars', { public: true })
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${user.id}/avatar-${Date.now()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { data: upload, error: uploadError } = await adminDb.storage
    .from('avatars')
    .upload(path, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = adminDb.storage.from('avatars').getPublicUrl(upload.path)

  return NextResponse.json({ url: publicUrl })
}
