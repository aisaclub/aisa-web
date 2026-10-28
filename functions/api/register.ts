// Cloudflare Pages Function: /api/register
// Full Cloudflare D1 SQLite Database Integration for Club Registrations
import { sendRealEmail, renderWelcomeEmailHtml } from './_mailer';

interface Env {
  DB?: any;
  RESEND_API_KEY?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const data = await context.request.json() as any;

    if (!data.fullName || !data.studentId || !data.email) {
      return new Response(JSON.stringify({ error: 'Sila lengkapkan maklumat wajib' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const regId = `reg-${Date.now()}`;
    const membershipNumber = Math.floor(1000 + Math.random() * 9000);
    const membershipId = `AISA-2026-${membershipNumber}`;
    const registeredAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // 1. Send / Log Real Email using Resend
    const welcomeHtml = renderWelcomeEmailHtml({
      fullName: data.fullName,
      membershipId,
      studentId: data.studentId,
      program: data.program || '',
      semester: data.semester || '',
      aiInterest: data.aiInterest || '',
    });

    const mailResult = await sendRealEmail({
      to: data.email,
      subject: `[AISA UiTM Jasin] Kad Keahlian Digital & Pengesahan Ahli (${membershipId})`,
      html: welcomeHtml,
      apiKey: context.env.RESEND_API_KEY,
      gmailRelayUrl: (context.env as any).GMAIL_RELAY_URL,
    });

    const db = context.env.DB || (context.env as any)['context.env.DB'];

    if (db) {
      // 2. Insert into club_registrations table
      await db.prepare(
        `INSERT INTO club_registrations (
          id, full_name, student_id, email, phone_number, program, semester, ai_interest, membership_id, status, assigned_pic, registered_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          regId,
          data.fullName,
          data.studentId,
          data.email,
          data.phoneNumber || '',
          data.program || '',
          data.semester || '',
          data.aiInterest || '',
          membershipId,
          'Baru',
          data.assignedPic || 'Belum Ditetapkan',
          registeredAt
        )
        .run();

      // 3. Log confirmation email into email_logs table
      const logId = `log-${Date.now()}`;
      await db.prepare(
        'INSERT INTO email_logs (id, recipient_email, recipient_name, template_type, subject, sent_by) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(
          logId,
          data.email,
          data.fullName,
          'welcome',
          `[AISA UiTM Jasin] Kad Keahlian Digital & Pengesahan Ahli (${membershipId})`,
          mailResult.sent ? 'Resend API (Delivered)' : 'Sistem Pendaftaran D1'
        )
        .run();
    }

    const registration = {
      id: regId,
      fullName: data.fullName,
      studentId: data.studentId,
      email: data.email,
      phoneNumber: data.phoneNumber,
      program: data.program,
      semester: data.semester,
      aiInterest: data.aiInterest,
      membershipId,
      status: 'Baru',
      assignedPic: 'Belum Ditetapkan',
      registeredAt,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Pendaftaran berjaya disimpan ke Cloudflare D1!',
        registration,
        emailSent: mailResult.sent,
        emailStatus: mailResult.status,
        emailDetails: mailResult.data || mailResult.error || null,
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
        'SELECT * FROM club_registrations ORDER BY registered_at DESC'
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

export async function onRequestPatch(context: { request: Request; env: Env }) {
  try {
    const { id, status, assignedPic } = await context.request.json() as any;

    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'ID dan status diperlukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (context.env.DB) {
      await context.env.DB.prepare(
        'UPDATE club_registrations SET status = ?, assigned_pic = ? WHERE id = ?'
      )
        .bind(status, assignedPic || 'Belum Ditetapkan', id)
        .run();
    }

    return new Response(JSON.stringify({ success: true, id, status, assignedPic }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
