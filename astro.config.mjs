// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

import favicons from 'astro-favicons';
import preact from '@astrojs/preact';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  // when the value is changed, corresponding entry in .gitignore should be changed, too.
  cacheDir: './assets-cache',

  env: {
    schema: {
      /** database connection URI */
      DB_URI: envField.string({
        context: 'server',
        access: 'secret',
        default: 'mongodb://127.0.0.1:27017'
      })
    }
  },

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
  ],

  adapter: node({
    mode: 'standalone'
  })
});