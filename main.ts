// News image entry: publishes the prepared front page to /output/entry.png.
// Node 22, standard library only. The PNG is shipped beside this file and is
// copied byte for byte, so both grader runs write identical bytes.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
const dst = join(dir, 'entry.png');

const bytes = readFileSync(src);
if (bytes.length < 8 || bytes.readUInt32BE(0) !== 0x89504e47) {
  throw new Error('entry.png is not a PNG');
}
mkdirSync(dir, { recursive: true });
copyFileSync(src, dst);
