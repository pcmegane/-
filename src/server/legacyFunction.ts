import { requiredEnv, env } from './env';

export function hasBillingCredentials() {
  return Boolean(env('BILLING_SERVICE_URL') && env('BILLING_SERVICE_KEY'));
}

export async function legacyFunction(functionName: string, request: Request) {
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(
    `/functions/v1/${functionName}${sourceUrl.search}`,
    requiredEnv('VITE_SUPABASE_URL').replace(/\/$/, '') + '/',
  );
  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  const body = hasBody ? await request.text() : undefined;
  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers: {
      apikey: requiredEnv('VITE_SUPABASE_ANON_KEY'),
      Authorization: request.headers.get('Authorization') ?? '',
      'Content-Type': request.headers.get('Content-Type') ?? 'application/json',
    },
    body,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('Content-Type') ?? 'application/json',
    },
  });
}
