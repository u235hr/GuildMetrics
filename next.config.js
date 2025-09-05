/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发环境优化
  experimental: {
    // 空的experimental块，移除了turbo
  },
  
  // 使用推荐的turbopack配置
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // 编译优化
  compiler: {
    // 移除console.log（生产环境）
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 减少开发时的日志输出
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

module.exports = nextConfig;
