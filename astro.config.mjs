// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Change to https://overpowercardgame.com at cutover (Phase 5).
  // Until then this is the Cloudflare preview URL so sitemap/canonical URLs
  // never point at the live WordPress site by accident.
  site: 'https://overpower-site.pages.dev',

  output: 'static',

  integrations: [
    mdx(),
    sitemap({
      // Dev leftovers and duplicate legal pages stay out of the sitemap.
      filter: (page) => !/\/(test2|elementor-3490|privacy-policy-2|terms-of-service)\/?$/.test(page),
    }),
  ],

  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },

  build: {
    // /news/some-post/index.html — matches the existing flat WordPress URLs.
    format: 'directory',
  },
});
