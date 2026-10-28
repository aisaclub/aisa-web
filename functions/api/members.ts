// Cloudflare Pages Function: /api/members
// Direct Cloudflare D1 integration for Committee Members

export async function onRequestGet(context: { env: any }) {
  try {
    const db = context.env.DB || context.env['context.env.DB'];
    if (db) {
      const { results } = await db.prepare(
        "SELECT * FROM committee_members ORDER BY CASE level WHEN 'advisor' THEN 1 WHEN 'mt' THEN 2 WHEN 'head' THEN 3 ELSE 4 END, id ASC"
      ).all();
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
    const member = await context.request.json() as any;
    const db = context.env.DB || context.env['context.env.DB'];

    if (!member.id || !member.name) {
      return new Response(JSON.stringify({ error: 'ID dan nama diperlukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (db) {
      await db.prepare(
        `INSERT INTO committee_members (
          id, name, role, level, department, photo_url, bio, ai_specialty, year_program, linkedin_url, github_url, email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          role = excluded.role,
          level = excluded.level,
          department = excluded.department,
          photo_url = excluded.photo_url,
          bio = excluded.bio,
          ai_specialty = excluded.ai_specialty,
          year_program = excluded.year_program,
          linkedin_url = excluded.linkedin_url,
          github_url = excluded.github_url,
          email = excluded.email,
          updated_at = CURRENT_TIMESTAMP`
      )
        .bind(
          member.id,
          member.name,
          member.role,
          member.level || 'exco',
          member.department || 'Biro AI & Sains Data',
          member.photoUrl || member.photo_url || '',
          member.bio || '',
          member.aiSpecialty || member.ai_specialty || '',
          member.yearProgram || member.year_program || '',
          member.linkedin || member.linkedin_url || null,
          member.github || member.github_url || null,
          member.email || null
        )
        .run();
    }

    return new Response(JSON.stringify({ success: true, member }), {
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
      await db.prepare('DELETE FROM committee_members WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: `Exco ${id} telah dipadam.` }), {
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
