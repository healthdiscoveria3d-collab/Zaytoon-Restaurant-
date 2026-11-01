import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function createProjectZip() {
  console.log('Generating complete project zip archive for Zaytoon Restaurant...');
  const zip = new JSZip();

  const addDir = (currentPath: string, zipFolder: JSZip) => {
    const entries = fs.readdirSync(currentPath);
    for (const entry of entries) {
      if (
        entry === 'node_modules' ||
        entry === '.git' ||
        entry === 'dist' ||
        entry === '.cache' ||
        entry.endsWith('.zip')
      ) {
        continue;
      }

      const fullPath = path.join(currentPath, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const sub = zipFolder.folder(entry);
        if (sub) {
          addDir(fullPath, sub);
        }
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(entry, fileContent);
      }
    }
  };

  addDir(rootDir, zip);

  const zipContent = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const outputPath = path.join(rootDir, 'zaytoon-restaurant-website-complete.zip');
  fs.writeFileSync(outputPath, zipContent);
  console.log(`Zip archive successfully written to: ${outputPath} (${(zipContent.length / 1024).toFixed(1)} KB)`);
}

createProjectZip().catch(console.error);
