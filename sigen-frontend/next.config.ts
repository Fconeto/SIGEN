import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);