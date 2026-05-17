import { createFileRoute } from '@tanstack/react-router';
import {
  isUnauthorizedError,
  json,
  preflight,
  requireUser,
} from '@/server/api';
import { billing } from '@/server/billingClient';
import { hasBillingCredentials, legacyFunction } from '@/server/legacyFunction';

export const Route = createFileRoute('/api/billing-status')({
  server: {
    handlers: {
      OPTIONS: preflight,
      GET: async ({ request }) => {
        try {
          if (!hasBillingCredentials()) {
            return legacyFunction('billing-status', request);
          }
          const user = await requireUser(request);
          return json(await billing.getStatus(user.email!));
        } catch (err) {
          return json(
            {
              error: isUnauthorizedError(err)
                ? 'Unauthorized'
                : 'billing_failed',
            },
            isUnauthorizedError(err) ? 401 : 502,
          );
        }
      },
    },
  },
});
