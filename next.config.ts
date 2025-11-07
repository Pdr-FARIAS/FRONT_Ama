/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Adicione esta seção 'remotePatterns'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**', // Permite qualquer imagem desse host
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Já vou adicionar o de placeholder também
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

