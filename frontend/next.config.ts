/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "kmzmzmrdwbaaibcgqowh.supabase.co", // domain lama
      "backend.test",                     // tambahkan domain Laravel kamu
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "backend.test",
        port: "", // kosongkan jika tidak ada port
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
