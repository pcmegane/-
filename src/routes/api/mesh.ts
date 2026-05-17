import { createFileRoute } from '@tanstack/react-router';
import { handleMeshRequest } from '@/server/mesh';
import { hasBillingCredentials, legacyFunction } from '@/server/legacyFunction';

const handler = ({ request }: { request: Request }) =>
  hasBillingCredentials()
    ? handleMeshRequest(request)
    : legacyFunction('mesh', request);

export const Route = createFileRoute('/api/mesh')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
      OPTIONS: handler,
    },
  },
});
