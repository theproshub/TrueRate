/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      {
        source: '/entrepreneurship',
        destination: '/small-business',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
