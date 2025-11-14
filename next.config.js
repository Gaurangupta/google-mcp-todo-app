/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    GOOGLE_MAPS_MCP_URL: 'https://mcp.open-mcp.org/api/server/google-maps@latest/mcp'
  }
};

module.exports = nextConfig;