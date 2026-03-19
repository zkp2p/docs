import { docsLlms } from '@/lib/source';

export function GET() {
  return new Response(docsLlms.index(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
