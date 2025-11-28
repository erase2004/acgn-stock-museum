// @ts-check

import dayjs from 'dayjs';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

import favicons from 'astro-favicons';
import react from '@astrojs/react'
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap'
import { defaultWebsiteName, siteUrl } from './src/configs/sites';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: siteUrl,

  // when the value is changed, corresponding entry in .gitignore should be changed, too.
  cacheDir: './assets-cache',

  image: {
    service: {
      entrypoint: './src/libs/custom-sharp-service',
      config: {}
    },
    responsiveStyles: true,
  },

  env: {
    schema: {
      /** database connection URI */
      DB_URI: envField.string({
        context: 'server',
        access: 'secret',
        default: 'mongodb://127.0.0.1:27017'
      }),
      BUILD_ID: envField.number({
        context: 'client',
        access: 'public',
        default: dayjs().unix()
      })
    }
  },

  integrations: [
    favicons({
      input: {
        favicons: [
          "src/assets/icons/logo.png"
        ]
      },
      name: defaultWebsiteName,
      short_name: 'Museum Landmark',
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
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag']
      }
    }),
    sitemap({
      entryLimit: 10000,
      namespaces: {
        image: false,
        video: false,
      }
    })
  ],
});