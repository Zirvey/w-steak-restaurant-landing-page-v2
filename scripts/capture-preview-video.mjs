import puppeteer from 'puppeteer';
import { mkdir, rm, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FRAMES_DIR = path.join(ROOT, 'docs', 'screenshots', '_frames');
const OUT_MP4 = path.join(ROOT, 'preview-scroll.mp4');
const OUT_DOCS = path.join(ROOT, 'docs', 'preview-scroll.mp4');
const URL = process.env.SHOT_URL || 'http://127.0.0.1:8765/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const WIDTH = 1440;
const HEIGHT = 900;
const FPS = 15;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function easeInOut(p) {
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

await rm(FRAMES_DIR, { recursive: true, force: true });
await mkdir(FRAMES_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-dev-shm-usage', `--window-size=${WIDTH},${HEIGHT}`],
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

await page.evaluateOnNewDocument(() => {
  const style = document.createElement('style');
  style.textContent = `
    .concept-banner { display: none !important; }
    body.has-concept-banner { padding-top: 0 !important; }
    :root, html { --concept-banner-height: 0px !important; }
  `;
  document.documentElement.appendChild(style);

  // Disable Lenis so scripted window.scrollTo is predictable
  window.Lenis = undefined;
  Object.defineProperty(window, 'Lenis', {
    configurable: true,
    get() {
      return undefined;
    },
    set() {},
  });
});

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForSelector('.hero-display', { timeout: 15000 });

await page.evaluate(() => {
  document.getElementById('concept-banner')?.remove();
  document.body.classList.remove('has-concept-banner');
  document.documentElement.style.setProperty('--concept-banner-height', '0px');
  document.documentElement.classList.remove('lenis', 'lenis-smooth');
  window.scrollTo(0, 0);
});

await sleep(400);

// Replay hero entrance
await page.evaluate(() => {
  document.body.classList.remove('is-ready');
  document.querySelectorAll('.hero-split, .hero-anim').forEach((el) => el.classList.remove('is-in'));
});
await sleep(80);
await page.evaluate(() => {
  document.body.classList.add('is-ready');
  document.querySelectorAll('.hero-split, .hero-anim').forEach((el) => el.classList.add('is-in'));
});

const heroHoldMs = 2800;
const scrollMs = 16000;
const bottomHoldMs = 2200;
const totalMs = heroHoldMs + scrollMs + bottomHoldMs;
const totalFrames = Math.round((totalMs / 1000) * FPS);

const maxScroll = await page.evaluate(() => {
  const doc = document.documentElement;
  return Math.max(0, doc.scrollHeight - window.innerHeight);
});

console.log(`Recording full-page scroll ~${(totalMs / 1000).toFixed(1)}s (${totalFrames} frames, maxScroll=${maxScroll}px)`);

const start = Date.now();

for (let i = 0; i < totalFrames; i++) {
  const targetTime = (i / FPS) * 1000;
  const lag = targetTime - (Date.now() - start);
  if (lag > 0) await sleep(lag);

  const t = targetTime;
  let y = 0;
  if (t >= heroHoldMs && t <= heroHoldMs + scrollMs) {
    y = maxScroll * easeInOut((t - heroHoldMs) / scrollMs);
  } else if (t > heroHoldMs + scrollMs) {
    y = maxScroll;
  }

  await page.evaluate((scrollY) => {
    window.scrollTo(0, scrollY);
    window.dispatchEvent(new Event('scroll'));
    // Reveal sections as they enter the viewport during the recording
    document.querySelectorAll('.reveal, .reveal-in').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) el.classList.add('is-visible');
    });
  }, y);

  await page.screenshot({
    path: path.join(FRAMES_DIR, `frame-${String(i).padStart(4, '0')}.png`),
    type: 'png',
  });

  if (i % FPS === 0) console.log(`  ${Math.round(t / 1000)}s / y=${Math.round(y)}`);
}

await browser.close();

await run('ffmpeg', [
  '-y',
  '-framerate', String(FPS),
  '-i', path.join(FRAMES_DIR, 'frame-%04d.png'),
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-crf', '23',
  '-movflags', '+faststart',
  OUT_MP4,
]);

await rm(FRAMES_DIR, { recursive: true, force: true });

const { copyFile } = await import('fs/promises');
await copyFile(OUT_MP4, OUT_DOCS);

const info = await stat(OUT_MP4);
console.log(`Done: ${OUT_MP4} (${(info.size / 1024 / 1024).toFixed(1)} MB)`);
console.log(`Copy: ${OUT_DOCS}`);
