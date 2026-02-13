import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('subscribers')
      .upsert({ email, source: 'landing_page', subscribed_at: new Date().toISOString() }, { onConflict: 'email' })

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    // Send first issue via Resend
    try {
      const resend = getResend()
      const dataDir = join(process.cwd(), 'data', 'issues')
      const index = JSON.parse(readFileSync(join(dataDir, 'index.json'), 'utf-8'))
      if (index.length > 0) {
        const firstIssue = index[0]
        const html = readFileSync(join(dataDir, firstIssue.file), 'utf-8')
        await resend.emails.send({
          from: 'Campaign with AI <hello@ubi.studio>',
          to: email,
          subject: firstIssue.title,
          html,
        })
      }
    } catch (emailErr) {
      console.error('Email send error:', emailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Subscribe error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
