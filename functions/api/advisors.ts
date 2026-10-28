// Cloudflare Pages Function: /api/advisors
// Direct Cloudflare D1 integration for Lecturer Advisors

export async function onRequestGet(context: { env: any }) {
  try {
    const db = context.env.DB || context.env['context.env.DB'];
    if (db) {
      const { results } = await db.prepare('SELECT * FROM advisors ORDER BY id ASC').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPut(context: { request: Request; env: any }) {
  try {
    const adv = await context.request.json() as any;
    const db = context.env.DB || context.env['context.env.DB'];

    if (!adv.id || !adv.name) {
      return new Response(JSON.stringify({ error: 'ID dan nama penasihat diperlukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (db) {
      await db.prepare(
        `INSERT INTO advisors (
          id, name, title, faculty, room, email, photo_url, research_area, consultation_hours, google_scholar
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          title = excluded.title,
          faculty = excluded.faculty,
          room = excluded.room,
          email = excluded.email,
          photo_url = excluded.photo_url,
          research_area = excluded.research_area,
          consultation_hours = excluded.consultation_hours,
          google_scholar = excluded.google_scholar`
      )
        .bind(
          adv.id,
          adv.name,
          adv.title,
          adv.faculty || 'KPPIM UiTM Jasin',
          adv.room || '',
          adv.email || '',
          adv.photoUrl || adv.photo_url || '',
          adv.researchArea || adv.research_area || '',
          adv.consultationHours || adv.consultation_hours || '',
          adv.googleScholar || adv.google_scholar || null
        )
        .run();
    }

    return new Response(JSON.stringify({ success: true, advisor: adv }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context: { request: Request; env: any }) {
  return onRequestPut(context);
}

export async function onRequestDelete(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const db = context.env.DB || context.env['context.env.DB'];
    if (db && id) {
      await db.prepare('DELETE FROM advisors WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: `Penasihat ${id} telah dipadam.` }), {
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
