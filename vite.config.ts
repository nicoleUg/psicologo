import { defineConfig } from 'vitest/config'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
  
  test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: [
          'src/app/context/**/*.tsx',
          'src/app/lib/**/*.ts',
          'src/app/pages/**/*.tsx'
        ],
        exclude: [
          'src/app/components/**',
          'src/**/*.test.tsx',
          'src/**/*.test.ts'
        ]
      },
  },

});
