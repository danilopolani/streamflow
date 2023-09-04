/**
 * This script should be run in electron context
 * @example
 *  ELECTRON_RUN_AS_NODE=1 electron scripts/update-electron-vendors.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const electronRelease = process.versions;

const node = electronRelease.node.split('.')[0];
const chrome = electronRelease.v8.split('.').splice(0, 2).join('');

const browserslistrcPath = path.resolve(process.cwd(), '.browserslistrc');

writeFileSync('./.electron-vendors.cache.json', JSON.stringify({ chrome, node }));
writeFileSync(browserslistrcPath, `Chrome ${chrome}`, 'utf8');

// Copy the Key enum from nut to our renderer
let nutKeyEnumContent = readFileSync(path.join(
  path.resolve(process.cwd()),
  'node_modules',
  '@nut-tree',
  'nut-js',
  'dist',
  'lib',
  'key.enum.d.ts',
));

// Export it as an enum
nutKeyEnumContent = nutKeyEnumContent.toString().replace('export declare enum Key', 'export enum Key');

writeFileSync(
  path.join(
    path.resolve(process.cwd()),
    'packages',
    'renderer',
    'src',
    'enums',
    'nut-key.ts',
  ),
  nutKeyEnumContent,
);
