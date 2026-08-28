import path from 'node:path';
import { exists, readText, writeText, ok, warn } from './fs.mjs';
import { GLOBAL_CSS } from './ghost-theme-css.mjs';

export { GLOBAL_CSS };

export const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
`;

export const NATIVEWIND_ENV = `/// <reference types="nativewind/types" />

declare module '*.css' {}
`;

export function writeIfMissing(file, contents, { overwrite = false } = {}) {
  if (exists(file) && !overwrite) {
    warn(`Keep existing ${path.relative(process.cwd(), file)}`);
    return false;
  }
  writeText(file, contents);
  ok(`Wrote ${path.relative(process.cwd(), file)}`);
  return true;
}

export function ensureBabelConfig(
  cwd,
  framework = 'react-native',
  aliasRoot = './',
  { overwrite = false } = {}
) {
  const file = path.join(cwd, 'babel.config.js');
  const preset =
    framework === 'expo'
      ? `'babel-preset-expo'`
      : `'module:@react-native/babel-preset'`;
  const desired = `module.exports = {
  presets: [${preset}, 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': '${aliasRoot.replace(/\\/g, '/')}',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
`;

  if (!exists(file)) {
    writeText(file, desired);
    ok('Wrote babel.config.js');
    return;
  }

  const current = readText(file);
  const needsRepair =
    !current.includes('nativewind/babel') || current.includes('jsxImportSource');

  if (overwrite || needsRepair) {
    writeText(file, desired);
    ok(overwrite ? 'Updated babel.config.js' : 'Repaired babel.config.js (NativeWind preset)');
    return;
  }

  if (!current.includes('module-resolver')) {
    warn(
      'babel.config.js exists but is missing module-resolver for @/ aliases — install babel-plugin-module-resolver and add the plugin.'
    );
  }
}

export function ensureMetroConfig(cwd, framework = 'react-native', { overwrite = false } = {}) {
  const file = path.join(cwd, 'metro.config.js');
  const desired =
    framework === 'expo'
      ? `const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
`
      : `const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = mergeConfig(getDefaultConfig(__dirname), {});

module.exports = withNativeWind(config, { input: './global.css' });
`;

  if (!exists(file)) {
    writeText(file, desired);
    ok('Wrote metro.config.js');
    return;
  }

  const current = readText(file);
  const needsRepair = !current.includes('withNativeWind');

  if (overwrite || needsRepair) {
    writeText(file, desired);
    ok(
      overwrite
        ? 'Updated metro.config.js'
        : 'Repaired metro.config.js (withNativeWind for global.css)'
    );
    return;
  }
}

export function ensureTsconfigPaths(cwd, srcDir = '') {
  const file = path.join(cwd, 'tsconfig.json');
  if (!exists(file)) return;
  try {
    const raw = readText(file);
    const json = JSON.parse(raw);
    json.compilerOptions = json.compilerOptions || {};
    json.compilerOptions.baseUrl = json.compilerOptions.baseUrl || '.';
    const aliasTarget = srcDir ? `./${srcDir}/*` : './*';
    json.compilerOptions.paths = {
      ...(json.compilerOptions.paths || {}),
      '@/*': [aliasTarget],
    };
    if (!json.include) json.include = ['**/*.ts', '**/*.tsx'];
    if (!String(json.include).includes('nativewind-env.d.ts')) {
      json.include = [...new Set([...(json.include || []), 'nativewind-env.d.ts'])];
    }
    writeText(file, `${JSON.stringify(json, null, 2)}\n`);
    ok('Updated tsconfig.json paths for @/*');
  } catch {
    warn('Could not patch tsconfig.json automatically.');
  }
}
