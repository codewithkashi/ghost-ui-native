import { detectProject } from '../core/detect-project.mjs';
import { loadConfig } from '../core/config.mjs';
import {
  collectNpmDependencies,
  loadRegistry,
  resolveTree,
} from '../core/registry.mjs';
import { planItemFiles, writePlans } from '../core/write-files.mjs';
import { installDependencies } from '../core/dependency-installer.mjs';
import { fail, log, ok, parseArgs, warn } from '../core/fs.mjs';
import { initCommand } from './init.mjs';

export async function addCommand(argv, cwd) {
  const { flags, positionals } = parseArgs(argv);
  const yes = Boolean(flags.yes || flags.y);
  const overwrite = Boolean(flags.overwrite);
  const dryRun = Boolean(flags['dry-run']);
  const diff = Boolean(flags.diff);
  const all = Boolean(flags.all);

  let config = loadConfig(cwd);
  if (!config) {
    warn('ghost-ui.json missing — running init first…');
    await initCommand(['--yes'], cwd);
    config = loadConfig(cwd);
  }

  const project = detectProject(cwd);
  if (!project.ok) {
    fail(project.reason);
    return;
  }

  const registry = loadRegistry();
  const names = all
    ? registry.items.filter(i => i.type === 'registry:ui').map(i => i.name)
    : positionals;

  if (!names.length) {
    fail('Usage: ghost-ui add <component…> | ghost-ui add --all');
    return;
  }

  let items;
  try {
    items = resolveTree(registry, names);
  } catch (error) {
    fail(error.message);
    return;
  }

  log(`Adding: ${items.map(i => i.name).join(', ')}\n`);

  const plans = items.flatMap(item => planItemFiles(item, cwd, config));
  const { written, skipped } = writePlans(plans, { overwrite, dryRun, diff });

  const npmDeps = collectNpmDependencies(items).filter(dep => !project.deps[dep]);
  if (npmDeps.length) {
    if (dryRun) {
      ok(`[dry-run] would install ${npmDeps.join(', ')}`);
    } else if (yes) {
      installDependencies(cwd, npmDeps, { packageManager: project.packageManager });
    } else {
      warn(`Missing deps: ${npmDeps.join(', ')}`);
      warn('Re-run with --yes to install them automatically.');
    }
  }

  log(
    `\nDone. wrote=${written.length} skipped=${skipped.length}${dryRun ? ' (dry-run)' : ''}`
  );
}
