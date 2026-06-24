/**
 * Next.js configuration.
 *
 * Why this file exists: Next.js reads this file automatically on startup
 * to change its default behaviour. We only need one change for this
 * project: `pdfjs-dist` and `mammoth` read files from disk/buffers using
 * plain Node.js APIs, so we tell Next.js not to try to bundle them for
 * the browser. They only ever run on the server (inside our API routes).
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdfjs-dist", "mammoth"],
  devIndicators: false,
};

module.exports = nextConfig;
