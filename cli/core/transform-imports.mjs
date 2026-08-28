import { aliasImport } from './config.mjs';

/**
 * Rewrite package-internal relative imports for source-owned installs.
 * Same-folder `./foo` imports stay relative.
 */
export function transformImports(source, config) {
  const utils = aliasImport(config, 'utils');
  const lib = aliasImport(config, 'lib');
  const theme = aliasImport(config, 'theme');
  const ui = aliasImport(config, 'ui');

  let out = source;

  const rewrite = (pattern, replacement) => {
    out = out.replace(pattern, replacement);
  };

  // import/export from relative package paths
  rewrite(
    /(from\s+['"])\.\.\/\.\.\/lib\/utils(['"])/g,
    `$1${utils}$2`
  );
  rewrite(
    /(from\s+['"])\.\.\/lib\/utils(['"])/g,
    `$1${utils}$2`
  );
  rewrite(
    /(from\s+['"])\.\.\/\.\.\/lib\/keyboard(['"])/g,
    `$1${lib}/keyboard$2`
  );
  rewrite(
    /(from\s+['"])\.\.\/lib\/keyboard(['"])/g,
    `$1${lib}/keyboard$2`
  );
  rewrite(
    /(from\s+['"])\.\.\/\.\.\/theme\/theme(['"])/g,
    `$1${theme}/theme$2`
  );
  rewrite(
    /(from\s+['"])\.\.\/theme\/theme(['"])/g,
    `$1${theme}/theme$2`
  );
  rewrite(
    /(from\s+['"])\.\.\/components\/ui\/([^'"]+)(['"])/g,
    `$1${ui}/$2$3`
  );

  return out;
}

export function simpleDiff(existing, next, label) {
  if (existing === next) {
    return ` ${label}: unchanged`;
  }
  const a = existing.split(/\r?\n/);
  const b = next.split(/\r?\n/);
  const lines = [`--- existing ${label}`, `+++ next ${label}`];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i] === b[i]) continue;
    if (a[i] !== undefined) lines.push(`- ${a[i]}`);
    if (b[i] !== undefined) lines.push(`+ ${b[i]}`);
  }
  if (lines.length === 2) {
    lines.push('(content differs)');
  }
  return lines.join('\n');
}
