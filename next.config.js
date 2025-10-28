/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID,
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  }
};

module.exports = nextConfig;
