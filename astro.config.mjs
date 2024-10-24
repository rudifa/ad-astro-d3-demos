import { defineConfig } from 'astro/config';
import { viteStaticCopy } from 'vite-plugin-static-copy'

import vercel from '@astrojs/vercel/static';
import lit from '@astrojs/lit';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [lit()],
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@shoelace-style/shoelace/dist/assets/**/*',
            dest: './shoelace/assets'
          }
        ]
      })
    ]
  }
});
