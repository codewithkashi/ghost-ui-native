import path from 'node:path';
import { REGISTRY_PATH, exists, readJson, readText } from './fs.mjs';

export function loadRegistry() {
  if (!exists(REGISTRY_PATH)) {
    throw new Error(`Registry not found at ${REGISTRY_PATH}`);
  }
  return readJson(REGISTRY_PATH);
}

export function getItem(registry, name) {
  return registry.items.find(item => item.name === name) || null;
}

export function searchItems(registry, query) {
  const q = String(query || '').toLowerCase();
  if (!q) return registry.items;
  return registry.items.filter(item => {
    const hay = `${item.name} ${item.title || ''} ${item.description || ''} ${(item.dependencies || []).join(' ')}`.toLowerCase();
    return hay.includes(q);
  });
}

export function resolveTree(registry, names) {
  const queue = [...names];
  const seen = new Set();
  const collected = [];

  while (queue.length) {
    const name = queue.shift();
    if (seen.has(name)) continue;
    seen.add(name);
    const item = getItem(registry, name);
    if (!item) {
      throw new Error(`Unknown Ghost UI registry item: "${name}"`);
    }
    collected.push(item);
    for (const dep of item.registryDependencies || []) {
      if (!seen.has(dep)) queue.push(dep);
    }
  }

  return topoSort(collected);
}

function topoSort(items) {
  const byName = new Map(items.map(i => [i.name, i]));
  const indeg = new Map(items.map(i => [i.name, 0]));
  for (const item of items) {
    for (const dep of item.registryDependencies || []) {
      if (byName.has(dep)) {
        indeg.set(item.name, (indeg.get(item.name) || 0) + 1);
      }
    }
  }

  const queue = items.filter(i => (indeg.get(i.name) || 0) === 0).map(i => i.name);
  const out = [];
  while (queue.length) {
    const name = queue.shift();
    out.push(byName.get(name));
    for (const other of items) {
      if ((other.registryDependencies || []).includes(name)) {
        indeg.set(other.name, indeg.get(other.name) - 1);
        if (indeg.get(other.name) === 0) queue.push(other.name);
      }
    }
  }
  return out.length === items.length ? out : items;
}

export function collectNpmDependencies(items) {
  const deps = new Set();
  for (const item of items) {
    for (const dep of item.dependencies || []) deps.add(dep);
  }
  return [...deps];
}

export function readRegistryFileSource(filePath) {
  const candidate = path.join(path.dirname(REGISTRY_PATH), filePath);
  if (!exists(candidate)) {
    throw new Error(`Registry file missing: ${filePath}`);
  }
  return { abs: candidate, contents: readText(candidate) };
}

export function targetForFile(file) {
  if (file.target) return file.target.replace(/^\//, '');

  const p = file.path.replace(/\\/g, '/');
  if (p.includes('/components/ui/')) {
    return `components/ui/${p.split('/components/ui/')[1]}`;
  }
  if (p.includes('/lib/')) {
    return `lib/${p.split('/lib/')[1]}`;
  }
  if (p.includes('/theme/')) {
    return `theme/${p.split('/theme/')[1]}`;
  }
  if (p.includes('/providers/')) {
    return `components/${p.split('/providers/')[1]}`;
  }
  return p.replace(/^src\//, '');
}
