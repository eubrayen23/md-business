import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const DEEPSEEK_API_URL = Deno.env.get('DEEPSEEK_API_URL') ?? '';
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY') ?? '';

serve(async req => {
  try {
    const payload = await req.json();

    const response = await fetch(`${DEEPSEEK_API_URL}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        kind: 'chat-suggestion',
        prompt: payload.prompt,
        context: payload.context ?? {},
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'DeepSeek request failed' }), { status: 500 });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
