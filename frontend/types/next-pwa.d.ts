// types/next-pwa.d.ts

// This tells TypeScript that the 'next-pwa' module exists.
declare module 'next-pwa' {
  import { NextConfig } from 'next';

  // This defines the shape of the options you can pass to withPWA
  interface PWAConfig {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    // You can add other next-pwa options here if you use them
  }

  // This defines the main function you import
  // It's a higher-order function, so it returns another function
  const withPWA: (pwaConfig: PWAConfig) => (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}

