/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '88.222.215.5',
                port: '',
                pathname: '/v1/storage/**',
            },
            {
                protocol: 'https',
                hostname: '88.222.215.5',
                port: '',
                pathname: '/v1/storage/**',
            },
        ],
    },
};

export default nextConfig;
