import path from 'node:path';

/** Clean one filename (not a path). Only the final extension is preserved. */
export function fixFilename(filename, options = {}) {
  if (typeof filename !== 'string') throw new TypeError('filename must be a string');
  if (!filename || /[/\\\u0000]/u.test(filename) || filename === '.' || filename === '..') {
    throw new Error('Pass a single non-empty filename, not a path');
  }
  const { separator = '-', lowercase = true } = options;
  if (!['-', '_'].includes(separator)) throw new Error('separator must be "-" or "_"');
  if (typeof lowercase !== 'boolean') throw new TypeError('lowercase must be a boolean');
  const hidden = filename.startsWith('.');
  const visible = hidden ? filename.slice(1) : filename;
  const rawExtension = path.extname(visible);
  const rawStem = rawExtension ? visible.slice(0, -rawExtension.length) : visible;
  const clean = value => {
    let result = value.normalize('NFKD').replace(/\p{M}/gu, '')
      .replace(/[^\p{L}\p{N}]+/gu, separator)
      .replace(/^[-_]+|[-_]+$/gu, '');
    if (lowercase) result = result.toLowerCase();
    return result;
  };
  let stem = clean(rawStem) || 'file';
  if (/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/iu.test(stem)) stem = `file${separator}${stem}`;
  const extension = clean(rawExtension.slice(1));
  const result = `${hidden ? '.' : ''}${stem}${extension ? `.${extension}` : ''}`;
  if (Buffer.byteLength(result, 'utf8') > 255) throw new Error('Cleaned filename exceeds 255 UTF-8 bytes');
  return result;
}
