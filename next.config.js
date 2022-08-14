/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')(['referral-codes']);

module.exports = withTM(nextConfig);
