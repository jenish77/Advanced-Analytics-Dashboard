/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/en/dashboard",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
