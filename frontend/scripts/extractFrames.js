import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

const videoPath = path.resolve(__dirname, '../src/components/assets/Girl_Enters_Cosmic_Dream_World.mp4');
const framesDir = path.resolve(__dirname, '../public/frames');

if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

console.log('Extracting frames from:', videoPath);
console.log('Destination:', framesDir);

ffmpeg(videoPath)
  .outputOptions([
    '-vf', 'fps=15,scale=1280:-1',
    '-c:v', 'libwebp',
    '-quality', '80'
  ])
  .output(path.join(framesDir, 'frame_%04d.webp'))
  .on('end', () => {
    console.log('Extraction finished successfully!');
  })
  .on('error', (err) => {
    console.error('Error during extraction:', err.message);
  })
  .run();
