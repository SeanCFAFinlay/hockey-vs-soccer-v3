import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@hvsv3/shared': new URL('../../packages/shared/src/index.ts', import.meta.url).pathname,
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
});
