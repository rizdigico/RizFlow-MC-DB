/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/hyrve/:path*',
        destination: 'https://api.hyrveai.com/v1/:path*'
      }
    ]
  }
}

module.exports = nextConfig
