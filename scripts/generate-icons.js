import fs from 'fs';
import zlib from 'zlib';

// Simple CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // no interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0 (None)
  const scanlineWidth = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineWidth);
  for (let y = 0; y < height; y++) {
    rawData[y * scanlineWidth] = 0; // Filter 0
    const rowOffset = y * width * 4;
    rgbaBuffer.copy(rawData, y * scanlineWidth + 1, rowOffset, rowOffset + width * 4);
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate Snake App Icon
function renderSnakeIcon(size, isMaskable = false) {
  const buffer = Buffer.alloc(size * size * 4);

  // Colors
  const bgLcd = [139, 172, 15, 255];      // #8bac0f
  const bgInner = [155, 188, 15, 255];    // #9bbc0f
  const borderDark = [48, 98, 48, 255];   // #306230
  const snakeDark = [15, 56, 15, 255];    // #0f380f
  const gridLine = [145, 178, 15, 255];

  function setPixel(x, y, color) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const idx = (y * size + x) * 4;
    buffer[idx] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];
    buffer[idx + 3] = color[3];
  }

  function fillRect(rx, ry, rw, rh, color) {
    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) {
        setPixel(x, y, color);
      }
    }
  }

  // Base background
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      setPixel(x, y, bgLcd);
    }
  }

  const pad = isMaskable ? Math.round(size * 0.12) : Math.round(size * 0.06);
  const innerSize = size - pad * 2;

  // Inner border
  const bThick = Math.max(2, Math.round(size * 0.024));
  fillRect(pad, pad, innerSize, innerSize, borderDark);
  fillRect(pad + bThick, pad + bThick, innerSize - bThick * 2, innerSize - bThick * 2, bgInner);

  // Grid pattern
  const gridStep = Math.max(4, Math.round(size / 32));
  for (let y = pad + bThick; y < pad + innerSize - bThick; y += gridStep) {
    for (let x = pad + bThick; x < pad + innerSize - bThick; x++) {
      setPixel(x, y, gridLine);
    }
  }
  for (let x = pad + bThick; x < pad + innerSize - bThick; x += gridStep) {
    for (let y = pad + bThick; y < pad + innerSize - bThick; y++) {
      setPixel(x, y, gridLine);
    }
  }

  // Draw Pixel Snake segments relative to 512 base
  const scale = size / 512;
  function s(val) { return Math.round(val * scale); }

  const snakeSegments = [
    // Head
    { x: 280, y: 160, w: 48, h: 48, isHead: true },
    // Body
    { x: 220, y: 160, w: 48, h: 48 },
    { x: 160, y: 160, w: 48, h: 48 },
    { x: 160, y: 220, w: 48, h: 48 },
    { x: 160, y: 280, w: 48, h: 48 },
    { x: 220, y: 280, w: 48, h: 48 },
    { x: 280, y: 280, w: 48, h: 48 },
    { x: 340, y: 280, w: 48, h: 48 },
    { x: 340, y: 340, w: 48, h: 48 },
    // Tail
    { x: 280, y: 340, w: 48, h: 48 }
  ];

  for (const seg of snakeSegments) {
    fillRect(s(seg.x), s(seg.y), s(seg.w), s(seg.h), snakeDark);
    if (seg.isHead) {
      // Eye
      fillRect(s(304), s(172), s(12), s(12), bgInner);
    }
  }

  // Apple food
  fillRect(s(360), s(160), s(36), s(36), snakeDark);
  fillRect(s(374), s(146), s(8), s(14), snakeDark);

  // Bottom retro badge
  fillRect(s(156), s(412), s(200), s(36), borderDark);

  return encodePNG(size, size, buffer);
}

// Generate all sizes
fs.writeFileSync('public/icon-512.png', renderSnakeIcon(512, false));
fs.writeFileSync('public/icon-192.png', renderSnakeIcon(192, false));
fs.writeFileSync('public/icon-maskable-512.png', renderSnakeIcon(512, true));
fs.writeFileSync('public/apple-touch-icon.png', renderSnakeIcon(180, false));
fs.writeFileSync('public/favicon.png', renderSnakeIcon(64, false));

console.log('All icons generated successfully!');
