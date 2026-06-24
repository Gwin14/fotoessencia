import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const jobs = [
  // gallery / hero images: cap width, convert to webp
  { file: "src/assets/image/argentina1.jpg", maxWidth: 1600, quality: 78 },
  { file: "src/assets/image/argentina2.jpg", maxWidth: 1600, quality: 78 },
  { file: "src/assets/image/arte.jpg", maxWidth: 1200, quality: 78 },
  { file: "src/assets/image/aventuras.jpg", maxWidth: 1200, quality: 78 },
  { file: "src/assets/image/barcoCapa.jpg", maxWidth: 1920, quality: 78 },
  { file: "src/assets/image/cores.jpg", maxWidth: 1200, quality: 78 },
  { file: "src/assets/image/cultura.jpg", maxWidth: 1600, quality: 78 },
  { file: "src/assets/image/expressao.jpg", maxWidth: 1200, quality: 78 },
  { file: "src/assets/image/gaivota.jpg", maxWidth: 1600, quality: 78 },
  { file: "src/assets/image/historias.jpg", maxWidth: 1200, quality: 78 },
  { file: "src/assets/image/momentos.jpg", maxWidth: 1600, quality: 78 },
  { file: "src/assets/image/perspectiva.jpg", maxWidth: 1600, quality: 78 },
  { file: "src/assets/image/praiaGuarda.jpg", maxWidth: 1920, quality: 78 },
  { file: "src/assets/image/segredos.jpg", maxWidth: 1200, quality: 78 },
  { file: "src/assets/image/sentimentos.jpg", maxWidth: 1200, quality: 78 },
  { file: "src/assets/image/viajens.jpg", maxWidth: 1600, quality: 78 },
  { file: "src/assets/image/vida.jpg", maxWidth: 1200, quality: 78 },
  // icon used at max-width:500px in CSS -> 2x for retina is plenty
  { file: "src/assets/image/iconeKomorebi.png", maxWidth: 1000, quality: 80, keepAlpha: true },
  { file: "src/assets/mockupTriple.png", maxWidth: 1200, quality: 80, keepAlpha: true },
  { file: "src/assets/logo.png", maxWidth: 400, quality: 80, keepAlpha: true },
];

const root = process.cwd();

for (const job of jobs) {
  const srcPath = path.join(root, job.file);
  const ext = path.extname(job.file);
  const destPath = path.join(root, job.file.slice(0, -ext.length) + ".webp");

  const before = (await fs.stat(srcPath)).size;

  const img = sharp(srcPath).resize({ width: job.maxWidth, withoutEnlargement: true });

  await img.webp({ quality: job.quality, alphaQuality: job.keepAlpha ? 90 : undefined }).toFile(destPath);

  const after = (await fs.stat(destPath)).size;
  await fs.unlink(srcPath);

  console.log(
    `${job.file} -> ${path.basename(destPath)}  ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`
  );
}
