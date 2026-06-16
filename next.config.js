/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow THREE.js and R3F to work correctly with transpilation
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Webpack config for GLB/GLTF file handling and WASM (for Draco/Rapier)
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(glb|gltf)$/,
        type: "asset/resource",
        generator: { filename: "static/media/[name].[hash][ext]" },
      },
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      }
    );

    // Enable async WebAssembly for Rapier physics and Draco decoder
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    return config;
  },

  // Required for React Three Fiber 3D canvas to render correctly
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
