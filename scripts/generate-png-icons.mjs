import fs from 'fs';
import zlib from 'zlib';

function createPngBuffer(width, height, isMaskable = false) {
  // RGBA buffer
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  // Background color: #072a1a (r: 7, g: 42, b: 26)
  // Leaf fill: #86efac (r: 134, g: 239, b: 172)
  // Accent glow: #15803d (r: 21, g: 128, b: 61)

  const cx = width / 2;
  const cy = height / 2;
  const scale = isMaskable ? 0.35 : 0.42;
  const radius = width * scale;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      const dx = (x - cx) / radius;
      const dy = (y - cy) / radius;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if inside leaf shape
      // Leaf geometry: (dx^2 + (dy - 0.2)^2 < 0.8) and (dy > -0.9 && dy < 0.9)
      const inGlow = dist < 0.9;
      const inLeaf = (dx * dx * 1.8 + Math.pow(dy - 0.1, 2) < 0.65) && (dy > -0.85 && dy < 0.85);
      const isStem = inLeaf && Math.abs(dx) < 0.04;
      const isVein1 = inLeaf && dy > -0.3 && dy < -0.15 && Math.abs((dy + 0.3) * 1.5 - dx) < 0.04 && dx > 0;
      const isVein2 = inLeaf && dy > 0.0 && dy < 0.15 && Math.abs((dy) * 1.5 + dx) < 0.04 && dx < 0;
      const isVein3 = inLeaf && dy > 0.3 && dy < 0.45 && Math.abs((dy - 0.3) * 1.5 - dx) < 0.04 && dx > 0;

      if (isStem || isVein1 || isVein2 || isVein3) {
        // Deep forest vein
        rawData[pxOffset] = 7;
        rawData[pxOffset + 1] = 42;
        rawData[pxOffset + 2] = 26;
        rawData[pxOffset + 3] = 255;
      } else if (inLeaf) {
        // Mint leaf
        rawData[pxOffset] = 134;
        rawData[pxOffset + 1] = 239;
        rawData[pxOffset + 2] = 172;
        rawData[pxOffset + 3] = 255;
      } else if (inGlow) {
        // Subtle ambient green halo
        const factor = 1 - (dist - 0.65) / 0.25;
        rawData[pxOffset] = Math.round(7 + 14 * factor);
        rawData[pxOffset + 1] = Math.round(42 + 86 * factor);
        rawData[pxOffset + 2] = Math.round(26 + 35 * factor);
        rawData[pxOffset + 3] = 255;
      } else {
        // Background
        rawData[pxOffset] = 7;
        rawData[pxOffset + 1] = 42;
        rawData[pxOffset + 2] = 26;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  // Compress with deflate
  const compressed = zlib.deflateSync(rawData);

  // PNG structure
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);

    const crcInput = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(crcInput);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);

    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter: Adaptive
  ihdrData[12] = 0; // Interlace: None

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const icons = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const icon of icons) {
  const buf = createPngBuffer(icon.size, icon.size, icon.maskable);
  fs.writeFileSync(`./public/${icon.name}`, buf);
  console.log(`Generated ./public/${icon.name} (${buf.length} bytes)`);
}
