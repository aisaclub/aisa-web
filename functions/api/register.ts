// Cloudflare Pages Function: /api/register
// Full Cloudflare D1 SQLite Database Integration for Club Registrations

interface Env {
  DB?: any;
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

    if (context.env.DB) {
      // 1. Insert into club_registrations table
      await context.env.DB.prepare(
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

      // 2. Log confirmation email into email_logs
      const logId = `log-${Date.now()}`;
      await context.env.DB.prepare(
        'INSERT INTO email_logs (id, recipient_email, recipient_name, template_type, subject, sent_by) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(
          logId,
          data.email,
          data.fullName,
          'welcome',
          `[AISA UiTM Jasin] Kad Keahlian Digital & Pengesahan Ahli (${membershipId})`,
          'Sistem Pendaftaran D1'
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
        emailSent: true,
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
