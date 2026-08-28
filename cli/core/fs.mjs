import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Absolute path to ghost-ui-native package root */
export const PACKAGE_ROOT = path.resolve(__dirname, '../..');
export const REGISTRY_PATH = path.join(PACKAGE_ROOT, 'registry.json');
export const SRC_ROOT = path.join(PACKAGE_ROOT, 'src');

export function exists(p) {
  return fs.existsSync(p);
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

export function writeText(file, contents) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, contents, 'utf8');
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function copyFile(from, to) {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

export function parseArgs(argv) {
  const flags = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--') continue;
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else if (arg.startsWith('-') && arg.length === 2) {
      flags[arg.slice(1)] = true;
    } else {
      positionals.push(arg);
    }
  }
  return { flags, positionals };
}

export function log(msg = '') {
  console.log(msg);
}

export function ok(msg) {
  console.log(`✔ ${msg}`);
}

export function warn(msg) {
  console.warn(`⚠ ${msg}`);
}

export function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exitCode = 1;
}
