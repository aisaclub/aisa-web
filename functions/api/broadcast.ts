// Cloudflare Pages Function: /api/broadcast
// Dispatches campaign and logs records into Cloudflare D1 email_logs
import { sendRealEmail, renderBroadcastCampaignEmailHtml } from './_mailer';

interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
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

    const campaignHtml = renderBroadcastCampaignEmailHtml({
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content || '',
      date: campaign.eventDate,
      time: campaign.eventTime,
      location: campaign.eventLocation,
      templateStyle: campaign.templateStyle || 'tech_summit',
      senderRole: campaign.senderRole || 'Exco AISA',
      senderName: campaign.senderName || 'Barisan Majlis Tertinggi AISA',
    });

    let sentCount = 0;

    // If D1 is available, fetch real emails based on target audience
    const db = context.env.DB || (context.env as any)['context.env.DB'];
    if (db) {
      const target = campaign.targetAudience || 'all';
      let emailsToSend: string[] = [];

      if (target === 'subscribers' || target === 'all') {
        const { results: subResults } = await db.prepare('SELECT email FROM notice_subscribers').all();
        if (subResults) {
          emailsToSend.push(...subResults.map((r: any) => r.email));
        }
      }

      if (target === 'members' || target === 'all') {
        const { results: regResults } = await db.prepare('SELECT email FROM club_registrations').all();
        if (regResults) {
          emailsToSend.push(...regResults.map((r: any) => r.email));
        }
      }

      if (campaign.customRecipients && Array.isArray(campaign.customRecipients)) {
        emailsToSend.push(...campaign.customRecipients);
      }

      // Deduplicate emails
      const uniqueEmails = Array.from(new Set(emailsToSend));

      // Dispatch real email if RESEND_API_KEY is configured
      if (context.env.RESEND_API_KEY && uniqueEmails.length > 0) {
        for (const recipient of uniqueEmails) {
          await sendRealEmail({
            to: recipient,
            subject: campaign.subject,
            html: campaignHtml,
            apiKey: context.env.RESEND_API_KEY,
          });
          sentCount++;
        }
      }

      // Log broadcast in email_logs
      const logId = `camp-log-${Date.now()}`;
      await db.prepare(
        'INSERT INTO email_logs (id, recipient_email, recipient_name, template_type, subject, sent_by) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(
          logId,
          `broadcast_${target}@aisa.uitm.edu.my`,
          `Penerima (${uniqueEmails.length || campaign.recipientCount || 0} sasaran)`,
          campaign.templateStyle || 'tech_summit',
          campaign.subject,
          context.env.RESEND_API_KEY ? `Resend API (${sentCount} Dihantar)` : 'Simulasi Exco D1'
        )
        .run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        sentCount,
        message: `Kempen emel berjaya diproses! (${sentCount} emel dihantar melalui Resend API)`,
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

export async function onRequestGet(context: { env: any }) {
  try {
    const db = context.env.DB || context.env['context.env.DB'];
    if (db) {
      const { results } = await db.prepare(
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
