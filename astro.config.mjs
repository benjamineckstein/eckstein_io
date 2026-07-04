import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://eckstein.io',
  trailingSlash: 'always',
  output: 'static',
  build: {
    // Keep the whole page in one request: styles go inline into the HTML.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
})
