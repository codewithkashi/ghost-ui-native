import path from 'node:path';
import { detectProject } from '../core/detect-project.mjs';
import { loadConfig } from '../core/config.mjs';
import { loadRegistry, resolveTree } from '../core/registry.mjs';
import { planItemFiles } from '../core/write-files.mjs';
import { simpleDiff } from '../core/transform-imports.mjs';
import { fail, log, parseArgs } from '../core/fs.mjs';

export async function diffCommand(argv, cwd) {
  const { positionals } = parseArgs(argv);
  const name = positionals[0];
  if (!name) {
    fail('Usage: ghost-ui diff <component>');
    return;
  }

  const config = loadConfig(cwd);
  if (!config) {
    fail('ghost-ui.json not found. Run ghost-ui init first.');
    return;
  }

  const project = detectProject(cwd);
  if (!project.ok) {
    fail(project.reason);
    return;
  }

  const registry = loadRegistry();
  let items;
  try {
    items = resolveTree(registry, [name]);
  } catch (error) {
    fail(error.message);
    return;
  }

  const plans = items.flatMap(item => planItemFiles(item, cwd, config));
  let changed = 0;
  for (const plan of plans) {
    if (!plan.already) {
      log(`+ ${plan.relTarget} (missing locally)`);
      changed++;
      continue;
    }
    if (plan.identical) {
      log(`  ${plan.relTarget} (unchanged)`);
      continue;
    }
    log(simpleDiff(plan.existing, plan.contents, plan.relTarget));
    changed++;
  }
  log(`\n${changed} file(s) differ from registry`);
}
