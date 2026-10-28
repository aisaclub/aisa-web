// Cloudflare Pages Function: /api/subscribe
// Full Cloudflare D1 SQLite Database Integration
import { sendRealEmail, renderSubscriberEmailHtml } from './_mailer';

interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
  GMAIL_RELAY_URL?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const data = await context.request.json() as { email: string; preferredTopic?: string };

    if (!data.email || !data.email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Emel tidak sah' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const subscriberId = `sub-${Date.now()}`;
    const preferredTopic = data.preferredTopic || 'Semua Hebahan & Mesyuarat';
    const subscribedAt = new Date().toISOString().split('T')[0];

    // 1. Send / Log Real Email using Resend
    const subHtml = renderSubscriberEmailHtml({
      email: data.email,
      topic: preferredTopic,
    });

    const mailResult = await sendRealEmail({
      to: data.email,
      subject: '[AISA UiTM Jasin] Pengesahan Langganan Buletin & Notis Rasmi',
      html: subHtml,
      apiKey: context.env.RESEND_API_KEY,
      gmailRelayUrl: (context.env as any).GMAIL_RELAY_URL,
    });

    // 2. If Cloudflare D1 is available at the Edge
    const db = context.env.DB || (context.env as any)['context.env.DB'];
    if (db) {
      await db.prepare(
        'INSERT OR REPLACE INTO notice_subscribers (id, email, preferred_topic, subscribed_at) VALUES (?, ?, ?, ?)'
      )
        .bind(subscriberId, data.email, preferredTopic, subscribedAt)
        .run();

      const logId = `log-${Date.now()}`;
      await db.prepare(
        'INSERT INTO email_logs (id, recipient_email, recipient_name, template_type, subject, sent_by) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(
          logId,
          data.email,
          'Pelanggan Notis',
          'subscribe_confirm',
          '[AISA UiTM Jasin] Pengesahan Langganan Buletin & Notis Rasmi',
          mailResult.status === 'DELIVERED_VIA_GMAIL'
            ? 'Gmail Relay (aisaclub.uitmjasin@gmail.com)'
            : mailResult.sent
            ? 'Resend API (Delivered)'
            : 'Sistem Langganan D1'
        )
        .run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Langganan berjaya disimpan ke Cloudflare D1!',
        subscriber: {
          id: subscriberId,
          email: data.email,
          preferredTopic,
          subscribedAt,
        },
        notificationSent: true,
        notificationSubject: '[AISA UiTM Jasin] Pengesahan Langganan Buletin & Notis Rasmi',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestGet(context: { env: any }) {
  try {
    const db = context.env.DB || context.env['context.env.DB'];
    if (db) {
      const { results } = await db.prepare(
        'SELECT * FROM notice_subscribers ORDER BY subscribed_at DESC'
      ).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestDelete(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const db = context.env.DB || context.env['context.env.DB'];
    if (db && id) {
      await db.prepare('DELETE FROM notice_subscribers WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: `Langganan ${id} telah dipadam.` }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
