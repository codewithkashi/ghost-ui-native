import path from 'node:path';
import { exists, readJson } from './fs.mjs';

export function detectProject(cwd) {
  const pkgPath = path.join(cwd, 'package.json');
  if (!exists(pkgPath)) {
    return {
      ok: false,
      reason: 'No package.json found. Run this inside a React Native or Expo project.',
    };
  }

  const pkg = readJson(pkgPath);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  // Bare RN templates also ship app.json — only treat as Expo when the
  // expo package is present, or app config actually contains an "expo" key.
  const isExpo = Boolean(deps.expo || hasExpoAppConfig(cwd));
  const isRN = Boolean(deps['react-native']);
  const typescript = Boolean(
    deps.typescript ||
      exists(path.join(cwd, 'tsconfig.json')) ||
      exists(path.join(cwd, 'App.tsx')) ||
      exists(path.join(cwd, 'app'))
  );

  return {
    ok: isRN || isExpo,
    reason:
      isRN || isExpo
        ? null
        : 'This does not look like a React Native or Expo project.',
    framework: isExpo ? 'expo' : 'react-native',
    typescript,
    packageManager: detectPackageManager(cwd),
    pkg,
    pkgPath,
    deps,
  };
}

function hasExpoAppConfig(cwd) {
  const appJsonPath = path.join(cwd, 'app.json');
  if (exists(appJsonPath)) {
    try {
      const appJson = readJson(appJsonPath);
      if (appJson?.expo) return true;
    } catch {
      // ignore invalid json
    }
  }

  // app.config.js/ts are commonly Expo-only; still require expo dep when present
  // so bare RN projects with a similarly named file are not misclassified.
  return false;
}

function detectPackageManager(cwd) {
  if (exists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (exists(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (exists(path.join(cwd, 'bun.lockb')) || exists(path.join(cwd, 'bun.lock')))
    return 'bun';
  return 'npm';
}
