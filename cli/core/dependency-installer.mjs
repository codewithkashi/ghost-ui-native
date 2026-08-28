import { spawnSync } from 'node:child_process';
import { warn } from './fs.mjs';

export function installDependencies(cwd, packages, { packageManager = 'npm', dev = false } = {}) {
  const unique = [...new Set(packages.filter(Boolean))];
  if (!unique.length) return { ok: true, skipped: true };

  const args =
    packageManager === 'yarn'
      ? ['add', ...(dev ? ['--dev'] : []), ...unique]
      : packageManager === 'pnpm'
        ? ['add', ...(dev ? ['-D'] : []), ...unique]
        : packageManager === 'bun'
          ? ['add', ...(dev ? ['-d'] : []), ...unique]
          : ['install', ...(dev ? ['--save-dev'] : []), ...unique];

  const bin = packageManager;
  const result = spawnSync(bin, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    warn(`Failed to install: ${unique.join(', ')}`);
    return { ok: false };
  }
  return { ok: true, packages: unique };
}

export function ensurePeerRuntimeDeps(cwd, project, { yes = false } = {}) {
  const needed = [
    'ghost-ui-native',
    'nativewind',
    'tailwindcss@^3.4.17',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'lucide-react-native',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-svg',
    'react-native-worklets',
  ];

  const missing = needed.filter(name => {
    const id = name.split('@')[0];
    return !project.deps[id];
  });

  if (!missing.length) return { ok: true, installed: [] };

  if (!yes) {
    warn(`Missing runtime packages: ${missing.join(', ')}`);
    warn('Re-run with --yes to auto-install them.');
    return { ok: false, missing };
  }

  return installDependencies(cwd, missing, {
    packageManager: project.packageManager,
  });
}
