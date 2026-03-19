'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: () => void;
      };
    };
  }
}

type TweetEmbedProps = {
  tweetUrl: string;
};

const ALLOWED_TWEET_HOSTS = new Set([
  'x.com',
  'www.x.com',
  'twitter.com',
  'www.twitter.com',
  'mobile.twitter.com',
]);

function getSafeTweetUrl(tweetUrl: string): string | null {
  try {
    const url = new URL(tweetUrl);
    const pathSegments = url.pathname.split('/').filter(Boolean);

    if (url.protocol !== 'https:') return null;
    if (!ALLOWED_TWEET_HOSTS.has(url.hostname.toLowerCase())) return null;
    if (pathSegments.length < 3 || pathSegments[1] !== 'status') return null;

    return url.toString();
  } catch {
    return null;
  }
}

export function TweetEmbed({ tweetUrl }: TweetEmbedProps) {
  const safeTweetUrl = getSafeTweetUrl(tweetUrl);

  useEffect(() => {
    if (!safeTweetUrl) return;

    if (window.twttr?.widgets) {
      window.twttr.widgets.load();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-twitter-widget="true"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.dataset.twitterWidget = 'true';
    document.body.appendChild(script);
  }, [safeTweetUrl]);

  if (!safeTweetUrl) return null;

  return (
    <blockquote className="twitter-tweet" data-theme="dark">
      <a href={safeTweetUrl}>Loading tweet…</a>
    </blockquote>
  );
}
