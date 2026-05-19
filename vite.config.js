import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        propose: resolve(__dirname, 'propose.html'),
        shichigosan: resolve(__dirname, 'shichigosan.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
  server: {
    open: '/index.html',
  },
});
