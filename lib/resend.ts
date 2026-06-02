import { Resend } from 'resend'

// Server-only helper for sending emails via Resend.
// IMPORTANT: Do NOT read process.env.RESEND_API_KEY at module top-level in environments where it may be missing.
// Instead, the sendEmail function reads the env var at call-time and throws a clear error if missing.

export type EmailOptions = {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY env')

  const resend = new Resend(key)

  const from = options.from || 'no-reply@scalehub.example'

  const msg = await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html
  })

  return msg
}
