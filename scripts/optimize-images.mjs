import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory containing the images
const targetDir = path.resolve(__dirname, '../src/assets/icons/Past-event-imgs');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
      await optimizeImage(fullPath);
    }
  }
}

async function optimizeImage(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const basename = path.basename(filePath, ext);

  console.log(`Processing: ${basename}${ext}`);

  const image = sharp(filePath);
  const metadata = await image.metadata();

  // Define sizes
  const sizes = {
    lg: { width: Math.min(1280, metadata.width || 1280), quality: 80 },
    md: { width: Math.min(720, metadata.width || 720), quality: 80 },
    sm: { width: Math.min(360, metadata.width || 360), quality: 80 },
    blur: { width: 20, quality: 10, blur: true }
  };

  for (const [key, config] of Object.entries(sizes)) {
    const outPath = path.join(dir, `${basename}_${key}.webp`);
    
    // Skip if already exists to save time on reruns
    if (fs.existsSync(outPath)) {
      console.log(`  Skipping ${key} (already exists)`);
      continue;
    }

    let pipeline = image.clone().resize({ width: config.width, withoutEnlargement: true });
    
    if (config.blur) {
      pipeline = pipeline.blur(2);
    }

    await pipeline
      .webp({ quality: config.quality })
      .toFile(outPath);
      
    console.log(`  Generated ${basename}_${key}.webp`);
  }
}

async function main() {
  console.log('Starting image optimization...');
  try {
    await processDirectory(targetDir);
    console.log('Finished image optimization.');
  } catch (err) {
    console.error('Optimization failed:', err);
  }
}

main();
