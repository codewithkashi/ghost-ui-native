#!/usr/bin/env node
import { addCommand } from './commands/add.mjs';
import { initCommand } from './commands/init.mjs';
import { listCommand, searchCommand, viewCommand } from './commands/list.mjs';
import { diffCommand } from './commands/diff.mjs';
import { doctorCommand } from './commands/doctor.mjs';
import { fail, log } from './core/fs.mjs';

const cwd = process.cwd();
const [command, ...argv] = process.argv.slice(2);

function help() {
  log(`Ghost UI CLI

Usage:
  ghost-ui <command> [options]

Commands:
  init [--yes] [--overwrite]
  add <component…> [--all] [--yes] [--overwrite] [--dry-run] [--diff]
  list
  search <query>
  view <component>
  diff <component>
  doctor

Examples:
  npx ghost-ui-native init --yes
  npx ghost-ui-native add button card
  npx ghost-ui-native search dialog
`);
}

async function main() {
  try {
    switch (command) {
      case 'init':
        await initCommand(argv, cwd);
        break;
      case 'add':
        await addCommand(argv, cwd);
        break;
      case 'list':
        await listCommand(argv, cwd);
        break;
      case 'search':
        await searchCommand(argv, cwd);
        break;
      case 'view':
        await viewCommand(argv, cwd);
        break;
      case 'diff':
        await diffCommand(argv, cwd);
        break;
      case 'doctor':
        await doctorCommand(argv, cwd);
        break;
      case 'help':
      case '--help':
      case '-h':
      case undefined:
        help();
        break;
      default:
        fail(`Unknown command: ${command}`);
        help();
    }
  } catch (error) {
    fail(error?.stack || error?.message || String(error));
  }
}

main();
