// Cloudflare Worker Entrypoint: worker.ts
// Bridges Cloudflare Workers Static Assets with API Functions & Cloudflare D1

import { onRequestPost as handleRegisterPost, onRequestGet as handleRegisterGet } from './functions/api/register';
import { onRequestPost as handleSubscribePost, onRequestGet as handleSubscribeGet } from './functions/api/subscribe';
import { onRequestPost as handleBroadcastPost, onRequestGet as handleBroadcastGet } from './functions/api/broadcast';
import { onRequestGet as handleMembersGet } from './functions/api/members';

interface Env {
  DB: any;
  ASSETS?: any;
  RESEND_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. API Routing
    if (url.pathname === '/api/register') {
      if (request.method === 'POST') return handleRegisterPost({ request, env } as any);
      if (request.method === 'GET') return handleRegisterGet({ env } as any);
    }

    if (url.pathname === '/api/subscribe') {
      if (request.method === 'POST') return handleSubscribePost({ request, env } as any);
      if (request.method === 'GET') return handleSubscribeGet({ env } as any);
    }

    if (url.pathname === '/api/broadcast') {
      if (request.method === 'POST') return handleBroadcastPost({ request, env } as any);
      if (request.method === 'GET') return handleBroadcastGet({ env } as any);
    }

    if (url.pathname === '/api/members') {
      if (request.method === 'GET') return handleMembersGet({ env } as any);
    }

    // 2. Serve Vite SPA static assets from ./dist
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
