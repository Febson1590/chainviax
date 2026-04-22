/**
 * Chroma-key the solid background off the two horizontal Chainviax logos.
 *
 *   chainviax-logo.png        — solid near-black background
 *   chainviax-logo-light.png  — solid near-white background
 *
 * For each pixel we measure "distance" from the target background color.
 * Pixels close to the bg are made fully transparent; pixels near the edge
 * have their alpha ramped down linearly so the content keeps smooth edges
 * (gold gradient highlights and the white / black wordmark).
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.resolve("public");

async function keyOut(file, bgR, bgG, bgB, opts = {}) {
  const src = path.join(PUBLIC_DIR, file);
  const out = path.join(PUBLIC_DIR, file); // overwrite in place

  const { innerTolerance = 28, outerTolerance = 80 } = opts;

  const img = sharp(src).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const px = Buffer.from(data); // RGBA
  const { width, height, channels } = info;
  if (channels !== 4) throw new Error("expected RGBA buffer");

  for (let i = 0; i < px.length; i += 4) {
    const dr = px[i] - bgR;
    const dg = px[i + 1] - bgG;
    const db = px[i + 2] - bgB;
    // Perceptual distance in sRGB space, weighted for eye sensitivity.
    const d = Math.sqrt(0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db);

    if (d <= innerTolerance) {
      // Solid bg — fully transparent.
      px[i + 3] = 0;
    } else if (d < outerTolerance) {
      // Edge antialiased region — linear alpha ramp.
      const t = (d - innerTolerance) / (outerTolerance - innerTolerance);
      px[i + 3] = Math.round(255 * t);
    }
    // else: fully opaque content — leave alone.
  }

  await sharp(px, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out + ".tmp");
  await fs.rename(out + ".tmp", out);
  console.log(`✔ ${file} → transparent bg`);
}

await keyOut("chainviax-logo.png",       0,   0,   0);   // black bg
await keyOut("chainviax-logo-light.png", 255, 255, 255); // white bg
console.log("done.");
