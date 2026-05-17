import { createFileRoute } from '@tanstack/react-router';
import { handleCreativeChatRequest } from '@/server/creativeChat';
import { hasBillingCredentials, legacyFunction } from '@/server/legacyFunction';

const handler = ({ request }: { request: Request }) =>
  hasBillingCredentials()
    ? handleCreativeChatRequest(request)
    : legacyFunction('creative-chat', request);

export const Route = createFileRoute('/api/creative-chat')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
      OPTIONS: handler,
    },
  },
});
