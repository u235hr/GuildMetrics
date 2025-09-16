/** @type {import('next').NextConfig} */
const nextConfig = {
  // 服务端外部包
  serverExternalPackages: ['ogl', 'gsap'],
  
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['framer-motion', 'canvas-confetti'],
  },

  // 编译器优化
  compiler: {
    // 移除 console.log（仅生产环境）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack 配置优化
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 生产环境优化
    if (!dev) {
      // 代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // 将大型库单独打包
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // WebGL 相关库
          webgl: {
            test: /[\\/]node_modules[\\/](ogl|three)[\\/]/,
            name: 'webgl',
            chunks: 'all',
            priority: 20,
          },
          // 动画库
          animation: {
            test: /[\\/]node_modules[\\/](framer-motion|gsap|canvas-confetti)[\\/]/,
            name: 'animation',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    // 开发环境优化
    if (dev) {
      // 减少热重载检查的文件
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/public/**',
          '**/.next/**',
        ],
      };
      
      // 优化开发服务器性能
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }

    // 处理 WebGL 着色器文件
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    });

    return config;
  },

  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 天
  },

  // 性能优化
  poweredByHeader: false,
  generateEtags: false,
  
  // 压缩
  compress: true,

  // 环境变量
  env: {
    PERFORMANCE_MONITORING: process.env.NODE_ENV === 'development' ? 'true' : 'false',
    WEBGL_DEBUG: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  },

  // 重定向优化
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ranking',
        permanent: false,
      },
    ];
  },

  // 头部优化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // 字体预加载
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 静态资源缓存
      {
        source: '/avatars/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;