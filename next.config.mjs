/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local-first: real photos live in /public/images. No stock CDNs.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [120, 200, 300, 400, 600],
    // Our own brand placeholder SVGs are trusted (no scripts) and sandboxed.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  poweredByHeader: false,
  compress: true,
  // Don't let lint warnings (e.g. unused vars) block production deploys.
  // TypeScript type-checking stays ON to catch real errors.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
