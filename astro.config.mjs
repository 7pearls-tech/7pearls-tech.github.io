// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://7pearls-tech.github.io',
  trailingSlash: 'always',
  i18n: {
    locales: ['pl', 'en', 'de'],
    defaultLocale: 'pl',
    routing: { prefixDefaultLocale: false },
  },
});
