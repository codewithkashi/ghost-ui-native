import path from 'node:path';
import { exists, readText, writeText, ok, warn } from './fs.mjs';
import { transformImports, simpleDiff } from './transform-imports.mjs';
import { readRegistryFileSource, targetForFile } from './registry.mjs';

export function planItemFiles(item, cwd, config) {
  const plans = [];
  for (const file of item.files || []) {
    const { contents } = readRegistryFileSource(file.path);
    const transformed = transformImports(contents, config);
    const relTarget = targetForFile(file);
    const absTarget = path.join(cwd, config.srcDir || '', relTarget);
    const displayTarget = path
      .join(config.srcDir || '', relTarget)
      .replace(/\\/g, '/');
    const already = exists(absTarget);
    const existing = already ? readText(absTarget) : null;
    plans.push({
      item: item.name,
      relTarget: displayTarget,
      absTarget,
      contents: transformed,
      already,
      identical: already && existing === transformed,
      existing,
    });
  }
  return plans;
}

export function writePlans(plans, { overwrite = false, dryRun = false, diff = false } = {}) {
  const written = [];
  const skipped = [];

  for (const plan of plans) {
    if (plan.identical) {
      skipped.push({ ...plan, reason: 'identical' });
      continue;
    }
    if (plan.already && !overwrite) {
      skipped.push({ ...plan, reason: 'exists' });
      if (diff && plan.existing != null) {
        console.log(simpleDiff(plan.existing, plan.contents, plan.relTarget));
      } else {
        warn(`Skip ${plan.relTarget} (exists). Use --overwrite to replace.`);
      }
      continue;
    }

    if (diff && plan.existing != null) {
      console.log(simpleDiff(plan.existing, plan.contents, plan.relTarget));
    }

    if (dryRun) {
      ok(`[dry-run] would write ${plan.relTarget}`);
      written.push(plan);
      continue;
    }

    writeText(plan.absTarget, plan.contents);
    ok(`Wrote ${plan.relTarget}`);
    written.push(plan);
  }

  return { written, skipped };
}
