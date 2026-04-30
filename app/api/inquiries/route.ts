import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { data: { user } } = await supabase.auth.getUser()

  const inquiryData = {
    property_id: body.property_id,
    seller_id: body.seller_id,
    client_id: user?.id || null,
    contact_name: body.contact_name,
    contact_email: body.contact_email,
    contact_phone: body.contact_phone || null,
    message: body.message || null,
    preferred_viewing_date: body.preferred_viewing_date || null,
    status: 'new',
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiryData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
