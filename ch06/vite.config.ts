import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@mini-react/jsx-runtime': '/src/mini-react/jsx-runtime.ts',
      '@mini-react/jsx-dev-runtime': '/src/mini-react/jsx-dev-runtime.ts',
    },
  },
})
