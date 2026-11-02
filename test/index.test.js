import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fixFilename } from '../src/index.js';

test('normalizes names, accents, extensions and separators', () => {
  assert.equal(fixFilename('My Photo (Final).JPG'), 'my-photo-final.jpg');
  assert.equal(fixFilename('Résumé 2026.PDF'), 'resume-2026.pdf');
  assert.equal(fixFilename('你好 世界.txt'), '你好-世界.txt');
  assert.equal(fixFilename('My Report.PDF', { separator: '_', lowercase: false }), 'My_Report.PDF');
  assert.equal(fixFilename('archive.tar.gz'), 'archive-tar.gz');
  assert.equal(fixFilename('.ENV'), '.env');
  assert.equal(fixFilename('!!!.txt'), 'file.txt');
  assert.equal(fixFilename('CON.txt'), 'file-con.txt');
  assert.equal(fixFilename(' report. '), 'report');
});

test('rejects paths, invalid options and oversized names', () => {
  for (const value of ['', '.', '..', 'a/b', 'a\\b', 'a\u0000b']) assert.throws(() => fixFilename(value));
  assert.throws(() => fixFilename(42), TypeError);
  assert.throws(() => fixFilename('x', { separator: '/' }));
  assert.throws(() => fixFilename('x', { lowercase: 'yes' }));
  assert.throws(() => fixFilename('x'.repeat(256)));
});

const cli = fileURLToPath(new URL('../bin/cli.js', import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'filename-fixer-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('CLI previews without changes then writes while preserving content', async t => {
  const directory = await fixture(t);
  await writeFile(path.join(directory, 'My Photo.JPG'), 'original bytes');
  await writeFile(path.join(directory, '.Hidden File'), 'hidden');
  const preview = run(directory);
  assert.equal(preview.status, 0, preview.stderr);
  assert.match(preview.stdout, /Preview only/);
  assert.equal(await readFile(path.join(directory, 'My Photo.JPG'), 'utf8'), 'original bytes');
  const applied = run(directory, '--write');
  assert.equal(applied.status, 0, applied.stderr);
  assert.equal(await readFile(path.join(directory, 'my-photo.jpg'), 'utf8'), 'original bytes');
  assert.deepEqual((await readdir(directory)).sort(), ['.Hidden File', 'my-photo.jpg']);
});

test('CLI rejects collisions before changing any files', async t => {
  const directory = await fixture(t);
  for (const name of ['A File.txt', 'a-file.txt', 'Other File.txt']) await writeFile(path.join(directory, name), name);
  const result = run(directory, '--write');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Name conflict/);
  assert.equal((await readdir(directory)).length, 3);
  assert.equal(await readFile(path.join(directory, 'Other File.txt'), 'utf8'), 'Other File.txt');
});

test('CLI rejects two names that would converge and invalid arguments', async t => {
  const directory = await fixture(t);
  await writeFile(path.join(directory, 'A File.txt'), 'one');
  await writeFile(path.join(directory, 'A_File.txt'), 'two');
  assert.equal(run(directory, '--write').status, 1);
  assert.equal(run(directory, '--separator').status, 1);
  assert.equal(run(directory, '--unknown').status, 1);
  assert.equal(run('--help').status, 0);
});
