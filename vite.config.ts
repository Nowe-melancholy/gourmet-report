import devServer from '@hono/vite-dev-server';
import { defineConfig } from 'vite';
import pages from '@hono/vite-cloudflare-pages';

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/frontend/client.tsx',
          output: {
            entryFileNames: 'static/frontend/client.js',
          },
        },
      },
    };
  } else {
    return {
      ssr: {
        external: ['react', 'react-dom'],
      },
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx',
        }),
      ],
    };
  }
});
