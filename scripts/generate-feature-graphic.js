import fs from 'fs';
import zlib from 'zlib';

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

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdrData);

  const scanlineWidth = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineWidth);
  for (let y = 0; y < height; y++) {
    rawData[y * scanlineWidth] = 0;
    const rowOffset = y * width * 4;
    rgbaBuffer.copy(rawData, y * scanlineWidth + 1, rowOffset, rowOffset + width * 4);
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 5x7 Pixel Font for Retro Text rendering on LCD
const FONT_5X7 = {
  'З': [
    [1,1,1,1,0],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,0,0,0,1],
    [1,1,1,1,0]
  ],
  'М': [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'Е': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  'Й': [
    [0,1,1,0,0],
    [1,0,0,0,1],
    [1,0,0,1,1],
    [1,0,1,0,1],
    [1,1,0,0,1]
  ],
  'К': [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,1,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1]
  ],
  'А': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  ' ': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ],
  '3': [
    [1,1,1,1,0],
    [0,0,0,0,1],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [1,1,1,1,0]
  ],
  '1': [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0]
  ],
  '0': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ]
};

function generateFeatureGraphic() {
  const width = 1024;
  const height = 500;
  const buffer = Buffer.alloc(width * height * 4);

  function setPixel(x, y, color) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
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

  // Deep dark background with subtle vignette
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const distFromCenter = Math.hypot(x - width / 2, y - height / 2) / 600;
      const shade = Math.max(12, Math.round(28 - distFromCenter * 14));
      setPixel(x, y, [shade, shade + 2, shade + 5, 255]);
    }
  }

  // Draw Nokia 3310 Stylized Phone Silhouette on the left/center
  // Phone Body
  const phoneX = 64;
  const phoneY = 30;
  const phoneW = 340;
  const phoneH = 440;

  // Beveled phone plastic: #2a3e5c (Nokia dark blue)
  fillRect(phoneX, phoneY + 30, phoneW, phoneH - 60, [42, 62, 92, 255]);
  fillRect(phoneX + 20, phoneY, phoneW - 40, phoneH, [42, 62, 92, 255]);
  // Border highlight
  fillRect(phoneX + 10, phoneY + 10, phoneW - 20, phoneH - 20, [34, 50, 75, 255]);

  // Silver bezel around screen
  fillRect(phoneX + 40, phoneY + 35, phoneW - 80, 220, [195, 205, 218, 255]);
  fillRect(phoneX + 45, phoneY + 40, phoneW - 90, 210, [160, 172, 186, 255]);

  // Nokia logo in silver panel
  fillRect(phoneX + 115, phoneY + 48, 110, 12, [34, 50, 75, 255]);

  // LCD Screen (Green Matrix: #8bac0f)
  const lcdX = phoneX + 55;
  const lcdY = phoneY + 70;
  const lcdW = phoneW - 110;
  const lcdH = 165;

  fillRect(lcdX, lcdY, lcdW, lcdH, [139, 172, 15, 255]);
  // Inner dark border
  fillRect(lcdX + 3, lcdY + 3, lcdW - 6, lcdH - 6, [155, 188, 15, 255]);
  fillRect(lcdX + 5, lcdY + 5, lcdW - 10, lcdH - 10, [139, 172, 15, 255]);

  // Grid on LCD
  for (let gy = lcdY + 6; gy < lcdY + lcdH - 6; gy += 6) {
    for (let gx = lcdX + 6; gx < lcdX + lcdW - 6; gx++) {
      setPixel(gx, gy, [145, 178, 15, 255]);
    }
  }

  // Draw Pixel Snake on LCD
  const snakeDark = [15, 56, 15, 255];
  const segs = [
    { x: lcdX + 140, y: lcdY + 40, head: true },
    { x: lcdX + 120, y: lcdY + 40 },
    { x: lcdX + 100, y: lcdY + 40 },
    { x: lcdX + 80,  y: lcdY + 40 },
    { x: lcdX + 80,  y: lcdY + 60 },
    { x: lcdX + 80,  y: lcdY + 80 },
    { x: lcdX + 100, y: lcdY + 80 },
    { x: lcdX + 120, y: lcdY + 80 },
    { x: lcdX + 140, y: lcdY + 80 },
    { x: lcdX + 140, y: lcdY + 100 },
    { x: lcdX + 140, y: lcdY + 120 },
    { x: lcdX + 120, y: lcdY + 120 },
    { x: lcdX + 100, y: lcdY + 120 }
  ];

  for (const seg of segs) {
    fillRect(seg.x, seg.y, 16, 16, snakeDark);
    if (seg.head) {
      fillRect(seg.x + 10, seg.y + 4, 3, 3, [155, 188, 15, 255]);
    }
  }
  // Apple Food
  fillRect(lcdX + 175, lcdY + 40, 14, 14, snakeDark);
  fillRect(lcdX + 180, lcdY + 34, 4, 6, snakeDark);

  // Bonus Bug
  fillRect(lcdX + 45, lcdY + 115, 18, 18, snakeDark);
  fillRect(lcdX + 41, lcdY + 119, 4, 3, snakeDark);
  fillRect(lcdX + 63, lcdY + 119, 4, 3, snakeDark);
  fillRect(lcdX + 41, lcdY + 127, 4, 3, snakeDark);
  fillRect(lcdX + 63, lcdY + 127, 4, 3, snakeDark);

  // Score in LCD corner
  fillRect(lcdX + 10, lcdY + 12, 45, 10, snakeDark);

  // Phone Navi Button (Classic 3310 blue oval)
  fillRect(phoneX + 120, phoneY + 268, 100, 24, [58, 86, 128, 255]);
  // Soft buttons left/right
  fillRect(phoneX + 55, phoneY + 280, 50, 18, [50, 72, 108, 255]);
  fillRect(phoneX + 235, phoneY + 280, 50, 18, [50, 72, 108, 255]);

  // Keypad rows (12 keys)
  const keypadY = phoneY + 312;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const kx = phoneX + 60 + col * 78;
      const ky = keypadY + row * 28;
      fillRect(kx, ky, 64, 20, [195, 205, 218, 255]);
      fillRect(kx + 2, ky + 2, 60, 16, [215, 225, 238, 255]);
    }
  }

  // RIGHT SIDE: Typography & Feature Badges
  // Title "ЗМЕЙКА"
  function drawChar(char, startX, startY, pixelSize, color) {
    const matrix = FONT_5X7[char];
    if (!matrix) return 5 * pixelSize;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize, color);
        }
      }
    }
    return (matrix[0].length + 1) * pixelSize;
  }

  function drawText(text, x, y, size, color) {
    let curX = x;
    for (const ch of text) {
      curX += drawChar(ch, curX, y, size, color);
    }
  }

  // Accent line
  fillRect(460, 90, 8, 320, [16, 185, 129, 255]); // Emerald green bar

  // Big Retro Title
  drawText('ЗМЕЙКА', 490, 95, 16, [16, 185, 129, 255]); // Green glow
  drawText('3310', 490, 190, 14, [245, 158, 11, 255]); // Amber gold 3310

  // Badges container
  const badgeY = 280;
  const badges = [
    { title: 'ОФЛАЙН ИГРА БЕЗ ИНТЕРНЕТА', color: [16, 185, 129, 255] },
    { title: 'НОСТАЛЬГИЯ: 8-BIT ЗВУК И КОРПУС 3310', color: [59, 130, 246, 255] },
    { title: '3 РЕЖИМА И 5 РЕТРО-ТЕМ LCD', color: [245, 158, 11, 255] }
  ];

  badges.forEach((b, idx) => {
    const by = badgeY + idx * 42;
    // Box
    fillRect(490, by, 480, 32, [28, 35, 45, 255]);
    fillRect(490, by, 4, 32, b.color);
    // Dot indicator
    fillRect(505, by + 12, 8, 8, b.color);
  });

  return encodePNG(width, height, buffer);
}

fs.writeFileSync('public/feature-graphic.png', generateFeatureGraphic());
console.log('Feature graphic 1024x500 created successfully at public/feature-graphic.png');
