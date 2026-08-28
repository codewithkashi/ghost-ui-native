import { loadRegistry, searchItems } from '../core/registry.mjs';
import { fail, log, parseArgs } from '../core/fs.mjs';

export async function listCommand() {
  const registry = loadRegistry();
  log('Ghost UI registry\n');
  for (const item of registry.items) {
    const deps = (item.registryDependencies || []).join(', ');
    log(`  ${item.name.padEnd(16)} ${item.type}${deps ? `  → ${deps}` : ''}`);
  }
  log(`\n${registry.items.length} items`);
}

export async function searchCommand(argv) {
  const { positionals } = parseArgs(argv);
  const query = positionals[0];
  if (!query) {
    fail('Usage: ghost-ui search <query>');
    return;
  }
  const registry = loadRegistry();
  const hits = searchItems(registry, query);
  if (!hits.length) {
    log(`No matches for "${query}"`);
    return;
  }
  log(`Search: ${query}\n`);
  for (const item of hits) {
    log(`  ${item.name}  (${item.type})`);
  }
}

export async function viewCommand(argv) {
  const { positionals } = parseArgs(argv);
  const name = positionals[0];
  if (!name) {
    fail('Usage: ghost-ui view <component>');
    return;
  }
  const registry = loadRegistry();
  const item = registry.items.find(i => i.name === name);
  if (!item) {
    fail(`Unknown component: ${name}`);
    return;
  }
  log(JSON.stringify(item, null, 2));
}
