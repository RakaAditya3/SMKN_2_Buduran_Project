const nextConfig = {
  images: {

    domains: ["env-laravel.jh-beon.cloud"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "env-laravel.jh-beon.cloud",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
