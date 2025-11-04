import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
    build: {
      // 프로덕션 빌드 최적화
      minify: 'esbuild',
      sourcemap: false,
      // 프로덕션 모드 명시
      mode: isProduction ? 'production' : 'development',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  }
})

