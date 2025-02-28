import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  plugins: [
    reactRefresh(),
  ],
  esbuild: {
    jsxFactory: 'jsx',
    jsxInject: `import { jsx } from '@emotion/react';`,
  },
})
