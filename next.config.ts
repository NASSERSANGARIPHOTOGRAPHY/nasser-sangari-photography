import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Lets phones and tablets on the same Wi-Fi load the dev server.
   * Without this, Next blocks its own dev resources (hot reload, client chunks)
   * when the page is opened from anything other than localhost.
   *
   * Development only — it has no effect on a production build.
   */
  allowedDevOrigins: ["192.168.12.214", "*.local"],
};

export default nextConfig;
