// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import favicons from 'astro-favicons';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  cacheDir: './assets-cache', // when the value is changed, corresponding entry in .gitignore should be changed, too.
  integrations: [
    favicons({
      input: {
        favicons: [
          "src/assets/icons/favicon.svg"
        ]
      },
      name: '',
      short_name: '',
      icons: {
        favicons: true,
        android: true,
        appleIcon: true,
        appleStartup: true,
        windows: true,
        yandex: false
      },
      output: {
        images: true,
        files: true,
        html: true,
      },
    }),
    preact({
      compat: true
    })
  ]
});