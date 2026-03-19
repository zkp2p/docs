import { allDocsSource } from '@/lib/source';
import { siteConfig } from '@/lib/site';

export async function GET() {
  const pages = [...allDocsSource.getPages()].sort((a, b) => a.url.localeCompare(b.url));
  const chunks = ['# Peer Docs', `Base URL: ${siteConfig.siteUrl}`, ''];

  for (const page of pages) {
    const content = await page.data.getText('processed');

    chunks.push(`## ${page.data.title}`);
    chunks.push(`URL: ${new URL(page.url, siteConfig.siteUrl).toString()}`);
    chunks.push('');
    chunks.push(content.trim());
    chunks.push('');
  }

  return new Response(chunks.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
