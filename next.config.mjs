/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    // Reuse dynamic pages client-side for 30s: switching between
    // Dashboard/Expenses/Income/Debts doesn't re-render the server page
    // every time. Server Actions still revalidate on mutation.
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
