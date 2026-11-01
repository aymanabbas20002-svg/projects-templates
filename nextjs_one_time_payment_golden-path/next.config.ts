import type { NextConfig } from 'next';

// Sandbox preview only: Next gates dev assets and HMR by Origin, and the preview is served
// from its own host. Gated on BASE44_PREVIEW_MODE === '1' so local and deployed behaviour is
// untouched; see AGENTS.md at the repo root.
const previewDevOrigin =
  process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? `3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`
    : null;

const nextConfig: NextConfig = {
  ...(previewDevOrigin ? { allowedDevOrigins: [previewDevOrigin] } : {}),
  env: {
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: process.env.POSTHOG_ANALYTICS_API_KEY,
  },
  // Reverse proxy for PostHog (matches api_host in instrumentation-client.ts).
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
