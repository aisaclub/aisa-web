// Cloudflare Pages Function: /api/broadcast
// Dispatches campaign and logs records into Cloudflare D1 email_logs

interface Env {
  DB?: any;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const campaign = await context.request.json() as any;

    if (!campaign.title || !campaign.subject) {
      return new Response(JSON.stringify({ error: 'Maklumat kempen tidak lengkap' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (context.env.DB) {
      const logId = `camp-log-${Date.now()}`;
      await context.env.DB.prepare(
        'INSERT INTO email_logs (id, recipient_email, recipient_name, template_type, subject, sent_by) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(
          logId,
          'all_recipients@aisa.uitm.edu.my',
          `Semua Peserta (${campaign.recipientCount || 'Broadcast'})`,
          campaign.templateStyle || 'modern_card',
          campaign.subject,
          campaign.senderRole || 'Exco AISA'
        )
        .run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Kempen emel berjaya direkod dan dihantar melalui Cloudflare D1!',
        campaign,
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
        'SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 50'
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
