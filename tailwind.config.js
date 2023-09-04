const { readFileSync } = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, './packages/renderer/index.html'),
    path.join(__dirname, './packages/renderer/src/**/*.{vue,ts}'),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B087F4',
        light: '#D7B9FF',
        accent: '#8953E2',
        dark: '#1C1921',
        link: '#E6DBFF',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    plugin(function({ addBase }) {
      const preflightStyles = postcss.parse(
        readFileSync(require.resolve('tailwindcss/lib/css/preflight.css'), 'utf8'),
      );

      // Remove button's background preflight style because conflicting with Naive UI buttons
      preflightStyles.walkRules((rule) => {
        if (rule.selector.includes('button')) {
          rule.walkDecls(/^background/, (decl) => {
            decl.remove();
          });
        }
      });

      addBase(preflightStyles.nodes);
    }),
  ],
};
