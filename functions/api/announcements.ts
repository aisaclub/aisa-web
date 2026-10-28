// Cloudflare Pages Function: /api/announcements
// Direct Cloudflare D1 integration for Announcements & Events

export async function onRequestGet(context: { env: any }) {
  try {
    const db = context.env.DB || context.env['context.env.DB'];
    if (db) {
      const { results } = await db.prepare(
        'SELECT * FROM announcements ORDER BY date DESC, created_at DESC'
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

    if (!data.title || !data.description) {
      return new Response(JSON.stringify({ error: 'Tajuk dan penerangan diperlukan' }), { status: 400 });
    }

    const annId = data.id || `ann-${Date.now()}`;
    const annDate = data.date || new Date().toISOString().split('T')[0];

    if (db) {
      await db.prepare(
        `INSERT OR REPLACE INTO announcements (
          id, title, category, description, date, deadline, banner_url, banner_url2,
          registration_link, is_urgent, status, event_time, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          annId,
          data.title,
          data.category || 'Hebahan',
          data.description,
          annDate,
          data.deadline || null,
          data.bannerUrl || data.banner_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
          data.bannerUrl2 || data.banner_url2 || null,
          data.registrationLink || data.registration_link || '#join-us',
          data.isUrgent ? 1 : 0,
          data.status || 'Open',
          data.eventTime || data.event_time || null,
          data.location || null
        )
        .run();
    }

    return new Response(JSON.stringify({ success: true, id: annId }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function onRequestDelete(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID diperlukan' }), { status: 400 });
    }

    const db = context.env.DB || context.env['context.env.DB'];
    if (db) {
      await db.prepare('DELETE FROM announcements WHERE id = ?').bind(id).run();
    }

    return new Response(JSON.stringify({ success: true, message: `Hebahan ${id} telah dipadam.` }), {
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
