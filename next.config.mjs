/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.1.20', 'localhost'],
  devIndicators: false
  // {
  //   appIsrStatus: false,
  //   buildActivity: false,
  //   buildActivityPosition: 'bottom-right',
  // },
}

export default nextConfig
