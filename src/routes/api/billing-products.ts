import { createFileRoute } from '@tanstack/react-router';
import { billing, BillingClientError } from '@/server/billingClient';
import { json, preflight } from '@/server/api';
import { logError } from '@/server/serverLog';
import { hasBillingCredentials, legacyFunction } from '@/server/legacyFunction';

export const Route = createFileRoute('/api/billing-products')({
  server: {
    handlers: {
      OPTIONS: preflight,
      GET: async ({ request }) => {
        try {
          if (!hasBillingCredentials()) {
            return legacyFunction('billing-products', request);
          }
          const type = new URL(request.url).searchParams.get('type');
          if (type === 'subscription' || type === 'pack') {
            return json(await billing.getProductsByType(type));
          }
          return json(await billing.getAllProducts());
        } catch (err) {
          const status = err instanceof BillingClientError ? err.status : 502;
          logError(err, {
            functionName: 'billing-products',
            statusCode: status,
          });
          return json({ error: 'billing_products_unavailable' }, status);
        }
      },
    },
  },
});
