import { createFileRoute } from '@tanstack/react-router';
import { handleParametricChatRequest } from '@/server/parametricChat';
import { hasBillingCredentials, legacyFunction } from '@/server/legacyFunction';

const handler = ({ request }: { request: Request }) =>
  hasBillingCredentials()
    ? handleParametricChatRequest(request)
    : legacyFunction('parametric-chat', request);

export const Route = createFileRoute('/api/parametric-chat')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
      OPTIONS: handler,
    },
  },
});
