// News image entry: publishes the prepared front page to /output/entry.png.
// Node 22, standard library only. The PNG is shipped beside this file and is
// copied byte for byte, so both grader runs write identical bytes.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
const dst = join(dir, 'entry.png');

const bytes = readFileSync(src);
// The gate takes a whole PNG of at most 1 MiB and 1024 by 1024 pixels, so
// refuse anything outside those limits instead of writing a doomed image.
if (bytes.length < 33 || bytes.readUInt32BE(0) !== 0x89504e47) {
  throw new Error('entry.png is not a PNG');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (bytes.length > 1048576 || width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, ${bytes.length} bytes`);
}
// The image must be whole: its IEND chunk has to close the file exactly.
const iend = Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
if (!bytes.subarray(bytes.length - 12).equals(iend)) {
  throw new Error('entry.png does not end with an IEND chunk');
}
mkdirSync(dir, { recursive: true });
writeFileSync(dst, bytes);
console.log(`wrote ${width}x${height}, ${bytes.length} bytes to ${dst}`);
