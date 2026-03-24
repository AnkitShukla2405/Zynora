/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3pjqtpyq138wk.cloudfront.net", 
      },
    ],
  },

    async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: "http://localhost:4000/graphql",
      },
    ];
  },
};





module.exports = nextConfig;