import path from 'node:path';
import { exists, readJson, writeJson } from './fs.mjs';

export const DEFAULT_CONFIG = {
  $schema: 'https://www.npmjs.com/package/ghost-ui-native',
  style: 'default',
  typescript: true,
  framework: 'react-native',
  styling: 'nativewind',
  /** When set (e.g. "src"), files are written under this folder */
  srcDir: '',
  aliases: {
    components: '@/components',
    ui: '@/components/ui',
    lib: '@/lib',
    utils: '@/lib/utils',
    theme: '@/theme',
    hooks: '@/hooks',
  },
  theme: {
    css: './global.css',
    darkMode: 'class',
    defaultTheme: 'system',
  },
};

export function configPath(cwd) {
  return path.join(cwd, 'ghost-ui.json');
}

export function loadConfig(cwd) {
  const file = configPath(cwd);
  if (!exists(file)) return null;
  return { ...DEFAULT_CONFIG, ...readJson(file) };
}

export function saveConfig(cwd, config) {
  writeJson(configPath(cwd), config);
}

export function resolveAliasPath(cwd, config, aliasKey, ...parts) {
  const alias = config.aliases?.[aliasKey] || DEFAULT_CONFIG.aliases[aliasKey];
  // "@/components/ui" -> "components/ui"
  const relative = String(alias).replace(/^@\//, '');
  return path.join(cwd, relative, ...parts);
}

export function aliasImport(config, aliasKey, subpath = '') {
  const alias = config.aliases?.[aliasKey] || DEFAULT_CONFIG.aliases[aliasKey];
  if (!subpath) return alias;
  return `${alias.replace(/\/$/, '')}/${subpath.replace(/^\//, '')}`;
}
