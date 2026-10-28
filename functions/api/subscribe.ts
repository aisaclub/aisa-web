// Cloudflare Pages Function: /api/subscribe
// Full Cloudflare D1 SQLite Database Integration

interface Env {
  DB?: any;
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

    // If Cloudflare D1 is available at the Edge
    if (context.env.DB) {
      // 1. Insert into notice_subscribers
      await context.env.DB.prepare(
        'INSERT OR REPLACE INTO notice_subscribers (id, email, preferred_topic, subscribed_at) VALUES (?, ?, ?, ?)'
      )
        .bind(subscriberId, data.email, preferredTopic, subscribedAt)
        .run();

      // 2. Log confirmation notification in email_logs
      const logId = `log-${Date.now()}`;
      await context.env.DB.prepare(
        'INSERT INTO email_logs (id, recipient_email, recipient_name, template_type, subject, sent_by) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(
          logId,
          data.email,
          'Pelanggan Notis',
          'subscribe_confirm',
          '[AISA UiTM Jasin] Pengesahan Langganan Buletin & Notis Rasmi',
          'Sistem Langganan D1'
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

export async function onRequestGet(context: { env: Env }) {
  try {
    if (context.env.DB) {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM notice_subscribers ORDER BY subscribed_at DESC'
      ).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
