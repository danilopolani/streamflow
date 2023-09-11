/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json';
import vue from '@vitejs/plugin-vue';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { renderer } from 'unplugin-auto-expose';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import { injectAppVersion } from '../../version/inject-app-version-plugin.mjs';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

const env = {
  ...process.env,
  ...loadEnv(process.env.MODE, PROJECT_ROOT, ''),
};

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  base: '',

  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
      '~shared/': join(PACKAGE_ROOT, '..', 'shared') + '/',
    },
  },

  server: {
    fs: {
      strict: true,
    },
  },

  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },

  test: {
    environment: 'happy-dom',
  },

  plugins: [
    vue(),
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }),
    injectAppVersion(),
    sentryVitePlugin({
      org: 'theraloss',
      project: 'streamflow',
      authToken: env.SENTRY_AUTH_TOKEN,
      release: {
        name: process.env.npm_package_version,
      },
    }),
  ],
};

export default config;
