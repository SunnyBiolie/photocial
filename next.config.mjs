/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "telegraph-image-bak.pages.dev",
      },
    ],
  },
};

export default nextConfig;
