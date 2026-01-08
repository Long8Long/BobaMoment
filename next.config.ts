/**
 * Input: 无
 * Output: Next.js配置（PWA、React编译器等）
 * Position: 构建配置文件
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释
 */

import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 兼容 Turbopack
  turbopack: {},
  // 静态导出配置
  output: 'export',
  // 图片优化在静态导出时禁用
  images: {
    unoptimized: true,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // 缓存策略
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})(nextConfig);
