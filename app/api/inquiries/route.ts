import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

  // Notify the client (if logged in) that their inquiry was received
  // Notify the seller about a new inquiry on their property
  try {
    const admin = createAdminClient()
    const inserts = []
    if (user?.id) {
      inserts.push({
        user_id: user.id,
        type: 'new_inquiry',
        title: 'Inquiry Received',
        message: 'Your inquiry has been received. Our concierge will be in touch within 24 hours.',
        link: `/portfolio/${body.property_id}`,
      })
    }
    if (body.seller_id) {
      const isViewing = !!body.preferred_viewing_date || body.is_viewing_request
      inserts.push({
        user_id: body.seller_id,
        type: isViewing ? 'viewing_request' : 'new_inquiry',
        title: isViewing ? 'New Viewing Request' : 'New Inquiry',
        message: isViewing
          ? `${body.contact_name} has requested a private viewing${body.preferred_viewing_date ? ` on ${new Date(body.preferred_viewing_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}. Check your dashboard.`
          : `A client has expressed interest in your property. Check your listings for details.`,
        link: '/seller/dashboard',
      })
    }
    if (inserts.length > 0) await admin.from('notifications').insert(inserts)
  } catch {}

  return NextResponse.json({ data }, { status: 201 })
}
