import path from "path";

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),

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

export default nextConfig;