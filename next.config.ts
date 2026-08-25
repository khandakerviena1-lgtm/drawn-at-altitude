import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js blocks cross-origin requests to dev-only assets (JS chunks, HMR)
  // by default -- confirmed in the dev server log as the actual cause of
  // "mobile doesn't work": loading the site from a phone at the LAN address
  // (http://192.168.1.18:3000) returned the page's HTML, but every script
  // chunk and the HMR socket were silently blocked, so no JavaScript ever
  // ran. Every scroll interaction on this site depends on JS -- Lenis, the
  // sketchbook, the itinerary -- so a phone on that URL saw static, inert
  // HTML with none of it working, which reads exactly as "not working well".
  // If the LAN IP changes (different network, router reassigns it), update
  // this to match -- it is printed as "Network:" when `next dev` starts.
  allowedDevOrigins: ["192.168.1.18"],
};

export default nextConfig;
