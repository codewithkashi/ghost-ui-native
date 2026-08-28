import path from 'node:path';
import { detectProject } from '../core/detect-project.mjs';
import { loadConfig, configPath } from '../core/config.mjs';
import { exists, fail, log, ok, readText, warn } from '../core/fs.mjs';

export async function doctorCommand(_argv, cwd) {
  log('Ghost UI doctor\n');
  const project = detectProject(cwd);
  if (!project.ok) {
    fail(project.reason);
    return;
  }
  ok(`Project: ${project.framework}`);
  ok(`TypeScript: ${project.typescript}`);
  ok(`Package manager: ${project.packageManager}`);

  const config = loadConfig(cwd);
  const srcDir = config?.srcDir || '';
  const uiDir = path.join(cwd, srcDir, 'components', 'ui');
  const utilsTs = path.join(cwd, srcDir, 'lib', 'utils.ts');
  const utilsJs = path.join(cwd, srcDir, 'lib', 'utils.js');
  const uiLabel = srcDir ? `${srcDir}/components/ui` : 'components/ui';
  const utilsLabel = srcDir ? `${srcDir}/lib/utils.ts|js` : 'lib/utils.ts|js';

  const metroPath = path.join(cwd, 'metro.config.js');
  const babelPath = path.join(cwd, 'babel.config.js');
  const envPath = path.join(cwd, 'nativewind-env.d.ts');
  const metroText = exists(metroPath) ? readText(metroPath) : '';
  const babelText = exists(babelPath) ? readText(babelPath) : '';
  const envText = exists(envPath) ? readText(envPath) : '';

  const checks = [
    ['ghost-ui.json', exists(configPath(cwd))],
    ['global.css', exists(path.join(cwd, 'global.css'))],
    ['tailwind.config.js', exists(path.join(cwd, 'tailwind.config.js'))],
    ['metro.config.js', exists(metroPath)],
    ['metro withNativeWind', Boolean(metroText && metroText.includes('withNativeWind'))],
    ['babel.config.js', exists(babelPath)],
    ['babel nativewind/babel', Boolean(babelText && babelText.includes('nativewind/babel'))],
    [
      'babel no jsxImportSource',
      Boolean(babelText && !babelText.includes('jsxImportSource')),
    ],
    ['babel module-resolver', Boolean(babelText && babelText.includes('module-resolver'))],
    ['nativewind-env.d.ts', exists(envPath)],
    ["declare module '*.css'", Boolean(envText && envText.includes("declare module '*.css'"))],
    ['nativewind', Boolean(project.deps.nativewind)],
    ['tailwindcss', Boolean(project.deps.tailwindcss)],
    ['babel-plugin-module-resolver', Boolean(project.deps['babel-plugin-module-resolver'])],
    ['lucide-react-native', Boolean(project.deps['lucide-react-native'])],
    ['react-native-reanimated', Boolean(project.deps['react-native-reanimated'])],
    ['react-native-svg', Boolean(project.deps['react-native-svg'])],
    [uiLabel, exists(uiDir)],
    [utilsLabel, exists(utilsTs) || exists(utilsJs)],
  ];

  let failed = 0;
  for (const [label, pass] of checks) {
    if (pass) ok(label);
    else {
      warn(`Missing: ${label}`);
      failed++;
    }
  }

  if (config) {
    ok(`Config aliases ui=${config.aliases?.ui}`);
  }

  if (failed) {
    fail(`${failed} issue(s) found. Run: ghost-ui init --yes`);
    log('See SETUP.md for CSS / Metro / @/ alias troubleshooting.');
  } else {
    ok('All checks passed');
  }
}
