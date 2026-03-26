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
    // Determine if we are on Vercel or local
    const isProd = process.env.NODE_ENV === 'production';
    
    return [
      {
        source: "/api/graphql",
        destination: isProd 
          ? "http://zynora-api.duckdns.org/graphql" 
          : "http://localhost:4000/graphql",
      },
    ];
  },
};

module.exports = nextConfig;