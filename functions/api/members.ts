// Cloudflare Pages Function: /api/members
// Can be deployed directly to Cloudflare Pages edge network

export async function onRequestGet(context: { env: { DB?: any } }) {
  const { env } = context;

  // If Cloudflare D1 is bound
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM committee_members ORDER BY level ASC').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  // Fallback if running purely on static / client mode
  return new Response(JSON.stringify({ message: 'Cloudflare Pages Edge API Active' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
