import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hvsv3/shared': new URL('../../packages/shared/src/index.ts', import.meta.url).pathname,
    },
  },
});
