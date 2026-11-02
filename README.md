![filename-fixer — Messy filenames. Clean results.](https://raw.githubusercontent.com/sureshapps/filename-fixer/main/assets/banner.png)

<div align="center">

# ✨ filename-fixer

### Messy filenames. Clean results.

A tiny filename cleaner for your JavaScript projects and your terminal.

![Zero dependencies](https://img.shields.io/badge/dependencies-0-14b8a6?style=flat-square)
![Node.js 22 or newer](https://img.shields.io/badge/Node.js-22%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![TypeScript declarations](https://img.shields.io/badge/TypeScript-types_included-3178c6?style=flat-square&logo=typescript&logoColor=white)
![License MIT](https://img.shields.io/badge/license-MIT-8b5cf6?style=flat-square)

**[Install](#-install) · [Quick start](#-quick-start) · [Command line](#command-line) · [API](#api)**

</div>

---

```text
  My Photo (Final).JPG    →    my-photo-final.jpg
  Résumé 2026.PDF        →    resume-2026.pdf
  My Report.PDF         →    My_Report.PDF  (custom options)
```

## 💡 Small package, useful details

| Feature | What you get |
| :--- | :--- |
| 👀 Preview first | See proposed changes before renaming any files |
| 🧩 Use it your way | JavaScript API and a command-line tool |
| 🎛️ Choose your style | Hyphens or underscores, lowercase or preserved case |
| 🌍 Unicode aware | Preserve Unicode letters and numbers; remove combining accents |
| 🛑 Conflict checks | Stop before applying a batch with conflicting names |
| 📦 No dependencies | Node.js built-ins, with TypeScript declarations included |

## 📥 Install

Requires **Node.js 22+**. This package uses **ES modules** (`import`).

```sh
npm install @sureshkaleyannan/filename-fixer
```

## 🚀 Quick start

```js
import { fixFilename } from '@sureshkaleyannan/filename-fixer';

fixFilename('My Photo (Final).JPG');
// → 'my-photo-final.jpg'

fixFilename('Résumé 2026.PDF');
// → 'resume-2026.pdf'

fixFilename('My Report.PDF', {
  separator: '_',
  lowercase: false,
});
// → 'My_Report.PDF'
```

### Try it in your terminal

Preview changes in your photos folder:

```sh
npx --package=@sureshkaleyannan/filename-fixer filename-fixer ./photos
```

```text
"My Photo (Final).JPG" → "my-photo-final.jpg"
Preview only. Add --write to apply.
```

Happy with the preview? Apply it:

```sh
npx --package=@sureshkaleyannan/filename-fixer filename-fixer ./photos --write
```

---

## API

`fixFilename(filename, options?)` returns a cleaned filename without touching the filesystem.

| Argument | Default | Description |
| --- | --- | --- |
| `filename` | required | A single filename, including its extension; paths are rejected |
| `options.separator` | `'-'` | `'-'` or `'_'` |
| `options.lowercase` | `true` | Whether to lowercase letters |

Rules:

- Normalize Unicode, remove combining accent marks, and preserve Unicode letters and numbers. This does not transliterate every writing system.
- Replace spaces and punctuation with the chosen separator.
- Preserve only the final extension: `archive.tar.gz` becomes `archive-tar.gz`.
- Preserve a leading dot in the API: `.ENV` becomes `.env`.
- Use `file` when the cleaned stem is empty; prefix reserved Windows device names with `file-` (or `file_`).
- Reject empty names, paths, NUL characters, invalid options, and output longer than 255 UTF-8 bytes. Filesystem-specific limits may differ.

## Command line

After installing globally with `npm install -g @sureshkaleyannan/filename-fixer`:

```sh
filename-fixer ./photos
filename-fixer ./photos --write
filename-fixer ./photos --separator _ --keep-case
filename-fixer --version
```

The current directory is used if no directory is supplied. Only regular files directly inside that directory are processed. Hidden files, folders and symbolic links are skipped; there is no recursive mode.

All names are checked before changes start. Conflicts, including case-only renames and two names that clean to the same result, stop the operation. Comparison is conservatively case-insensitive even on case-sensitive systems. Resolve conflicts manually and preview again.

To avoid replacing an existing destination, applying a change creates a hard link under the new name, then removes the old name. Filesystems must support hard links. File contents and metadata are retained. A batch is not transactional: an I/O failure can leave earlier renames completed; interruption between the two steps can leave both names. Avoid concurrently modifying the directory, and keep backups of important files.

## 🛠️ Local development

From a checkout or the complete source ZIP:

```sh
npm ci
npm test
node bin/cli.js --help
npm pack --dry-run
```

No runtime or development dependencies. No build step.

The source project includes API tests, filesystem integration tests, and a GitHub Actions workflow configured for Windows and Linux on Node.js 22 and 24.

## 📄 License

**MIT** · Copyright (c) 2026 **sureshkaleyannan**.

---

<div align="center">

Made by **sureshkaleyannan** · A little less mess, one filename at a time.

</div>
