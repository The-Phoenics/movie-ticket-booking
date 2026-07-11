import "@movie-ticket-booking/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
