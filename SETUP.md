# Setup & troubleshooting (React Native CLI + NativeWind)

When scaffolding or consuming `ghost-ui-native` in a framework-less React Native CLI app with NativeWind v4 and TypeScript 6, these three failures commonly appear if install steps are incomplete. **TypeScript path aliases alone are not enough**; Metro/Babel and CSS types must also be configured.

Prefer:

```bash
npm install ghost-ui-native
npx ghost-ui-native init --yes
```

Then restart Metro with `--reset-cache`.

---

## Error 1 — TypeScript: CSS side-effect import

### Symptom

```text
Cannot find module or type declarations for side-effect import of './global.css'.
```

Usually on:

```ts
import './global.css';
```

### Root cause

TypeScript 6 enables `noUncheckedSideEffectImports` by default. Side-effect imports must resolve to a real module or an ambient declaration. NativeWind’s `nativewind/types` do **not** declare `*.css`, so `import './global.css'` fails typechecking even though the file exists.

### Fix

In `nativewind-env.d.ts` (keep the NativeWind reference and add the CSS declaration):

```ts
/// <reference types="nativewind/types" />

declare module '*.css' {}
```

Ensure `tsconfig.json` includes that file:

```json
{
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"]
}
```

### Notes

- Do **not** name this file `nativewind.d.ts` (NativeWind docs warn that breaks type pickup).
- This is a **type-only** fix; it does not make Metro load CSS.

---

## Error 2 — Metro: unable to resolve `./global.css`

### Symptom

```text
Error: Unable to resolve module ./global.css from App.tsx:
None of these files exist:
  * global.css(.android.js|.native.js|.js|...)
  * global.css
> 1 | import './global.css';
```

### Root cause

Metro does not understand CSS by default. NativeWind v4 requires:

- `withNativeWind` in `metro.config.js` (registers CSS handling / input)
- `nativewind/babel` in `babel.config.js` (JSX / `className` interop)

Without those, `import './global.css'` is treated like a normal JS module and fails resolution.

### Fix — `metro.config.js` (RN CLI)

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = mergeConfig(getDefaultConfig(__dirname), {
  /* your config */
});

module.exports = withNativeWind(config, { input: './global.css' });
```

`input` must match `ghost-ui.json` → `theme.css` (default `./global.css`).

### Fix — `babel.config.js`

```js
module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    // module-resolver — see Error 3
    'react-native-reanimated/plugin',
  ],
};
```

Use `nativewind/babel` as a **preset** (not a plugin). Do not set `jsxImportSource: 'nativewind'` on the React Native preset — that breaks `import './global.css'` resolution in some setups.

### Also required

- `global.css` at the project root (or the path you pass to `input`) with at least:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- `tailwind.config.js` with `presets: [require('nativewind/preset')]` and `content` covering the app + `./components/**/*`
- Root import remains: `import './global.css';`

### After changing Metro/Babel

```bash
npx react-native start --reset-cache
```

### Related warning (usually harmless)

```text
WARN Attempted to import .../ReactNativeFeatureFlags which is not listed in the "exports" of "react-native"...
```

Fallbacks to file-based resolution; unrelated to CSS. Ignore unless something else breaks.

---

## Error 3 — Metro: unable to resolve `@/lib/utils` (and other `@/` imports)

### Symptom

```text
Error: Unable to resolve module @/lib/utils from components/ui/input.tsx:
@/lib/utils could not be found within the project or in these directories:
  node_modules
> 3 | import { cn } from '@/lib/utils';
```

Same pattern for `@/theme/theme`, `@/components/...`, etc.

### Root cause

Generated components use aliases from `ghost-ui.json`:

```json
"aliases": {
  "components": "@/components",
  "ui": "@/components/ui",
  "lib": "@/lib",
  "utils": "@/lib/utils",
  "theme": "@/theme"
}
```

`tsconfig.json` `paths` only helps the IDE / TypeScript:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Metro does not read `tsconfig` paths.** Without Babel (or Metro) alias rewriting, `@/lib/utils` stays unresolved at bundle time.

### Fix

Install (if missing):

```bash
npm install --save-dev babel-plugin-module-resolver
```

Extend `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
```

This maps `@/lib/utils` → `./lib/utils` (project root). For Expo apps that keep sources under `src/`, use `'@': './src'` instead (what `ghost-ui init` writes when it detects `src/`).

Reset Metro cache again:

```bash
npx react-native start --reset-cache
```

### Verify

Babel should rewrite:

```ts
import { cn } from '@/lib/utils';
// → require("../../lib/utils") from components/ui/*
```

A full bundle should succeed:

```bash
npx react-native bundle --platform android --dev true --entry-file index.js --bundle-output /tmp/test.bundle --assets-dest /tmp/test-assets --reset-cache
```

---

## Consumer checklist (RN CLI + NativeWind)

| Step | File / action | Purpose |
|------|----------------|---------|
| 1 | `nativewind` + `tailwindcss@^3.4` + peers (reanimated, safe-area-context, svg, …) | Styling runtime |
| 2 | `global.css` + `tailwind.config.js` with `nativewind/preset` | Theme tokens / utilities |
| 3 | `metro.config.js` → `withNativeWind(..., { input: './global.css' })` | Resolve & process CSS |
| 4 | `babel.config.js` → preset `nativewind/babel` | `className` / CSS interop |
| 5 | `import './global.css'` in app entry (`App.tsx`) | Load global styles |
| 6 | `nativewind-env.d.ts` with `nativewind/types` and `declare module '*.css' {}` | TS6 side-effect import |
| 7 | `tsconfig` paths: `"@/*": ["./*"]` | Editor / `tsc` aliases |
| 8 | `babel-plugin-module-resolver` alias `"@": "./"` | Metro aliases for generated `@/` imports |
| 9 | Restart with `--reset-cache` after Metro/Babel changes | Avoid stale transform cache |

---

## Short troubleshooting blurb

- If Metro fails on `./global.css`, wrap Metro with `withNativeWind` and add the `nativewind/babel` preset.
- If TypeScript fails on `import './global.css'`, add `declare module '*.css' {}` (required on TypeScript 6+).
- If Metro fails on `@/lib/utils`, `tsconfig` paths are not enough — configure `babel-plugin-module-resolver` with `"@": "./"` and restart Metro with `--reset-cache`.

`npx ghost-ui-native init` patches or creates Metro, Babel (`nativewind/babel` + `module-resolver`), and `nativewind-env.d.ts` for you. Run `npx ghost-ui-native doctor` to verify.

---

## Failure order (as seen in practice)

1. Fix TS CSS declaration → editor error gone; app still crashes without Metro CSS support.
2. Fix Metro/Babel NativeWind → CSS resolves; next failure is `@/` aliases.
3. Fix `module-resolver` + cache reset → bundle succeeds.
