import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';

type NotificationPayload = {
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const payload = (await req.json()) as NotificationPayload;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${payload.user_id}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'User lookup failed' }), { status: 500 });
  }

  const [user] = await response.json();
  if (!user?.push_token) {
    return new Response(JSON.stringify({ error: 'User has no push token' }), { status: 400 });
  }

  const expoResponse = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: user.push_token,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
    }),
  });

  if (!expoResponse.ok) {
    const expoError = await expoResponse.text();
    return new Response(JSON.stringify({ error: expoError }), { status: 502 });
  }

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
});
