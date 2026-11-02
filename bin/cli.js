#!/usr/bin/env node
import { readdir, link, unlink } from 'node:fs/promises';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
import { fixFilename } from '../src/index.js';

const help = `Usage: filename-fixer [directory] [options]

Preview filename changes in a directory (default: current directory).

  --write          Apply changes
  --separator _    Use underscores (also accepts -)
  --keep-case      Preserve letter case
  --help, -h       Show help
  --version, -v    Show version

Only regular files in this directory are considered. Hidden files,
directories and symbolic links are skipped. Existing names are never replaced.`;

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) return console.log(help);
  if (args.includes('--version') || args.includes('-v')) return console.log(version);
  let directory;
  let write = false;
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--write') write = true;
    else if (arg === '--keep-case') options.lowercase = false;
    else if (arg === '--separator') {
      options.separator = args[++i];
      if (!['-', '_'].includes(options.separator)) throw new Error('--separator requires - or _');
    } else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else if (directory !== undefined) throw new Error('Pass only one directory');
    else directory = arg;
  }
  const root = path.resolve(directory ?? '.');
  const entries = await readdir(root, { withFileTypes: true });
  const occupied = new Set(entries.map(entry => entry.name.toLowerCase()));
  const changes = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || entry.name.startsWith('.')) continue;
    const target = fixFilename(entry.name, options);
    if (target === entry.name) continue;
    // Case-only changes are skipped to behave consistently on case-insensitive disks.
    if (occupied.has(target.toLowerCase())) throw new Error(`Name conflict for ${JSON.stringify(entry.name)} â†’ ${JSON.stringify(target)}. No changes applied.`);
    occupied.add(target.toLowerCase());
    changes.push({ from: entry.name, to: target });
  }
  if (!changes.length) return console.log('No filenames need fixing.');
  for (const change of changes) {
    if (write) {
      const source = path.join(root, change.from);
      const target = path.join(root, change.to);
      // Creating a hard link fails if the exact destination already exists.
      // Remove the original name only after the new name exists.
      await link(source, target);
      try { await unlink(source); }
      catch (error) {
        throw new Error(`Could not remove ${JSON.stringify(change.from)}; both names may exist. ${error.message}`);
      }
    }
    console.log(`${JSON.stringify(change.from)} â†’ ${JSON.stringify(change.to)}`);
  }
  console.log(write ? `Renamed ${changes.length} file(s).` : 'Preview only. Add --write to apply.');
}

main().catch(error => {
  console.error(`filename-fixer: ${error.message}`);
  process.exitCode = 1;
});
