import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    port: 5174, // 你可以設置你想要的端口
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'], // 導入時想要省略的擴展名列表
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
