/**
 * Cloudflare Pages Function — POST /contact
 *
 * Scaffold for the forms that currently run through WordPress: Contact,
 * Retail Inquiries, the Judge Quiz and the Ambassador Quiz.
 *
 * Free tier covers 100,000 requests/day, which is far beyond what these forms see.
 *
 * Before this goes live it needs:
 *   1. A destination — set MAIL_TO and an API key for whichever sender you use
 *      (Resend, Postmark, MailChannels) in the Cloudflare Pages environment vars.
 *   2. Turnstile or a honeypot. Public contact forms get scraped fast.
 */
export async function onRequestPost({ request, env }) {
  const form = await request.formData();

  // Honeypot: real people leave this empty.
  if (form.get('company')) {
    return new Response(null, { status: 204 });
  }

  const payload = {
    name: String(form.get('name') ?? '').slice(0, 200),
    email: String(form.get('email') ?? '').slice(0, 200),
    subject: String(form.get('subject') ?? 'Website enquiry').slice(0, 200),
    message: String(form.get('message') ?? '').slice(0, 5000),
  };

  if (!payload.email || !payload.message) {
    return Response.json({ ok: false, error: 'Email and message are required.' }, { status: 400 });
  }

  if (!env.MAIL_TO || !env.MAIL_API_KEY) {
    // Fail loudly in the logs rather than silently swallowing a real enquiry.
    console.error('contact: MAIL_TO / MAIL_API_KEY not configured');
    return Response.json(
      { ok: false, error: 'The contact form is not connected yet. Email us directly in the meantime.' },
      { status: 503 }
    );
  }

  // TODO(phase-2): send via the chosen provider using env.MAIL_API_KEY.
  return Response.json({ ok: true });
}
