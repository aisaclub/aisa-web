// Cloudflare Pages Function: /api/activities
// Direct Cloudflare D1 integration for Activities & Archive

export async function onRequestGet(context: { env: any }) {
  try {
    const db = context.env.DB || context.env['context.env.DB'];
    if (db) {
      const { results } = await db.prepare(
        'SELECT * FROM activities ORDER BY event_date DESC, created_at DESC'
      ).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const data = await context.request.json() as any;
    const db = context.env.DB || context.env['context.env.DB'];

    if (!data.title || !data.summary) {
      return new Response(JSON.stringify({ error: 'Tajuk dan ringkasan aktiviti diperlukan' }), { status: 400 });
    }

    const actId = data.id || `act-${Date.now()}`;
    const actDate = data.date || data.event_date || new Date().toISOString().split('T')[0];
    const galleryJson = typeof data.gallery === 'string' ? data.gallery : JSON.stringify(data.gallery || []);

    if (db) {
      await db.prepare(
        `INSERT OR REPLACE INTO activities (
          id, title, event_date, category, summary, cover_image, gallery,
          attendees_count, highlight_text, ai_field, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          actId,
          data.title,
          actDate,
          data.category || 'Workshop',
          data.summary,
          data.coverImage || data.cover_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
          galleryJson,
          Number(data.attendeesCount || data.attendees_count || 50),
          data.highlightText || data.highlight_text || '',
          data.aiField || data.ai_field || '',
          data.location || ''
        )
        .run();
    }

    return new Response(JSON.stringify({ success: true, id: actId }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestDelete(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const db = context.env.DB || context.env['context.env.DB'];
    if (db && id) {
      await db.prepare('DELETE FROM activities WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: `Aktiviti ${id} telah dipadam.` }), {
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
