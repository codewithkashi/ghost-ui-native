import path from 'node:path';
import { detectProject } from '../core/detect-project.mjs';
import { DEFAULT_CONFIG, saveConfig, loadConfig } from '../core/config.mjs';
import {
  ensureBabelConfig,
  ensureMetroConfig,
  ensureTsconfigPaths,
  GLOBAL_CSS,
  NATIVEWIND_ENV,
  TAILWIND_CONFIG,
  writeIfMissing,
} from '../core/setup-templates.mjs';
import { ensurePeerRuntimeDeps, installDependencies } from '../core/dependency-installer.mjs';
import { loadRegistry, resolveTree, collectNpmDependencies } from '../core/registry.mjs';
import { planItemFiles, writePlans } from '../core/write-files.mjs';
import { ensureDir, exists, fail, log, ok, parseArgs, warn } from '../core/fs.mjs';

export async function initCommand(argv, cwd) {
  const { flags } = parseArgs(argv);
  const yes = Boolean(flags.yes || flags.y);
  const overwrite = Boolean(flags.overwrite);

  const project = detectProject(cwd);
  if (!project.ok) {
    fail(project.reason);
    return;
  }

  log(`Ghost UI init (${project.framework})\n`);

  const config = {
    ...DEFAULT_CONFIG,
    framework: project.framework,
    typescript: project.typescript,
    srcDir:
      project.framework === 'expo' && exists(path.join(cwd, 'src'))
        ? 'src'
        : '',
  };
  saveConfig(cwd, config);
  ok('Created ghost-ui.json');

  ensureDir(path.join(cwd, config.srcDir || '', 'components', 'ui'));
  ensureDir(path.join(cwd, config.srcDir || '', 'lib'));
  ensureDir(path.join(cwd, config.srcDir || '', 'theme'));

  writeIfMissing(path.join(cwd, 'global.css'), GLOBAL_CSS, { overwrite });
  writeIfMissing(path.join(cwd, 'tailwind.config.js'), TAILWIND_CONFIG, {
    overwrite,
  });
  writeIfMissing(path.join(cwd, 'nativewind-env.d.ts'), NATIVEWIND_ENV, {
    overwrite,
  });

  ensureBabelConfig(
    cwd,
    project.framework,
    config.srcDir ? `./${config.srcDir}` : './',
    { overwrite }
  );
  ensureMetroConfig(cwd, project.framework, { overwrite });
  ensureTsconfigPaths(cwd, config.srcDir || '');

  // Seed utils + theme (+ toast/provider for GhostUIProvider)
  const registry = loadRegistry();
  const seedNames = ['utils', 'theme', 'toast', 'provider'].filter(name =>
    registry.items.some(i => i.name === name)
  );
  const items = resolveTree(registry, seedNames.length ? seedNames : ['utils']);
  const plans = items.flatMap(item => planItemFiles(item, cwd, config));
  writePlans(plans, { overwrite, dryRun: false });

  const npmDeps = [
    'ghost-ui-native',
    ...collectNpmDependencies(items),
    'nativewind',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'lucide-react-native',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-svg',
    'react-native-worklets',
  ];
  const uniqueNpmDeps = [...new Set(npmDeps)];
  const devDeps = ['tailwindcss@^3.4.17', 'babel-plugin-module-resolver'];

  if (yes) {
    installDependencies(cwd, uniqueNpmDeps, {
      packageManager: project.packageManager,
    });
    installDependencies(cwd, devDeps, {
      packageManager: project.packageManager,
      dev: true,
    });
  } else {
    const refreshed = detectProject(cwd);
    ensurePeerRuntimeDeps(cwd, refreshed, { yes: false });
    warn('Run with --yes to auto-install ghost-ui-native and runtime dependencies.');
    warn(`Suggested: ${project.packageManager} install ${uniqueNpmDeps.join(' ')}`);
    warn(`Suggested: ${project.packageManager} install -D ${devDeps.join(' ')}`);
  }

  log('\nNext steps:');
  log('  1. Import ./global.css once at your app entry');
  log('  2. Wrap the root with GhostUIProvider from ./components/ghost-ui-provider');
  log('  3. ghost-ui add button');
  log('  4. Restart Metro with --reset-cache');
}
