import { sentryVitePlugin } from '@sentry/vite-plugin';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import { node } from '../../.electron-vendors.cache.json';
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

  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
      '~shared/': join(PACKAGE_ROOT, '..', 'shared') + '/',
    },
  },

  build: {
    ssr: true,
    sourcemap: true,
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: [
        'src/index.ts',
      ],
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },

  define: {
    'process.env.TWITCH_CLIENT_ID': JSON.stringify(env.TWITCH_CLIENT_ID),
    'process.env.TWITCH_CLIENT_SECRET': JSON.stringify(env.TWITCH_CLIENT_SECRET),
  },

  plugins: [
    injectAppVersion(),
    sentryVitePlugin({
      org: 'theraloss',
      project: 'streamflow',
      authToken: env.SENTRY_AUTH_TOKEN,
      disable: !env.UPLOAD_SOURCEMAPS,
      release: {
        name: process.env.npm_package_version,
      },
    }),
  ],
};

export default config;
