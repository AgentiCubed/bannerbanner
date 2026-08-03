#!/usr/bin/env node
// Generate the BannerBanner extension icons (16/32/48/128 px) as real PNGs.
//
// Dependency-free: rasterizes a simple banana-crescent mark and encodes the
// PNG by hand using node:zlib for the IDAT stream. Deterministic output so the
// committed icons are reproducible: `node scripts/generate-icons.mjs`.

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'extension', 'icons');
const SIZES = [16, 32, 48, 128];

// --- minimal PNG encoder -----------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // filter 0 per scanline
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- icon rasterizer ----------------------------------------------------------

// Palette
const BG = [245, 158, 11]; // amber-500
const BG_EDGE = [217, 119, 6]; // amber-600 subtle border
const BANANA = [255, 251, 235]; // warm cream crescent

function roundedRectAlpha(x, y, size, radius) {
  // Distance-based alpha for a rounded square centered in the canvas.
  const min = 0.5;
  const max = size - 0.5;
  const cx = Math.min(Math.max(x, min + radius), max - radius);
  const cy = Math.min(Math.max(y, min + radius), max - radius);
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, Math.min(1, radius - dist + 0.5));
}

function crescentAlpha(x, y, size) {
  // Banana crescent = big circle minus offset circle, tilted.
  const s = size;
  const c1x = s * 0.5;
  const c1y = s * 0.52;
  const r1 = s * 0.34;
  const c2x = s * 0.40;
  const c2y = s * 0.40;
  const r2 = s * 0.30;
  const d1 = Math.hypot(x - c1x, y - c1y);
  const d2 = Math.hypot(x - c2x, y - c2y);
  const inBig = Math.max(0, Math.min(1, r1 - d1 + 0.5));
  const outSmall = Math.max(0, Math.min(1, d2 - r2 + 0.5));
  return inBig * outSmall;
}

function renderIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const radius = size * 0.22;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const shape = roundedRectAlpha(px, py, size, radius);
      if (shape <= 0) continue;

      // Slight edge darkening for definition at small sizes.
      const edge = roundedRectAlpha(px, py, size, radius - Math.max(1, size * 0.04));
      let r = BG_EDGE[0] + (BG[0] - BG_EDGE[0]) * edge;
      let g = BG_EDGE[1] + (BG[1] - BG_EDGE[1]) * edge;
      let b = BG_EDGE[2] + (BG[2] - BG_EDGE[2]) * edge;

      const banana = crescentAlpha(px, py, size);
      if (banana > 0) {
        r = r + (BANANA[0] - r) * banana;
        g = g + (BANANA[1] - g) * banana;
        b = b + (BANANA[2] - b) * banana;
      }

      const i = (y * size + x) * 4;
      rgba[i] = Math.round(r);
      rgba[i + 1] = Math.round(g);
      rgba[i + 2] = Math.round(b);
      rgba[i + 3] = Math.round(shape * 255);
    }
  }
  return encodePng(size, size, rgba);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const size of SIZES) {
  const file = join(OUT_DIR, `icon-${size}.png`);
  writeFileSync(file, renderIcon(size));
  console.log(`wrote ${file}`);
}
