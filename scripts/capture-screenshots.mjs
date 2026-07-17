import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const URL = process.env.SHOT_URL || 'http://127.0.0.1:8765/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const shots = [
  { name: 'hero-desktop', width: 1440, height: 900, scrollTo: 0, fullPage: false },
  { name: 'experience', width: 1440, height: 900, scrollTo: '#experience', fullPage: false },
  { name: 'menu', width: 1440, height: 900, scrollTo: '#menu', fullPage: false },
  { name: 'about', width: 1440, height: 900, scrollTo: '#about', fullPage: false },
  { name: 'hero-mobile', width: 390, height: 844, scrollTo: 0, fullPage: false },
];

async function preparePage(page) {
  await page.evaluate(() => {
    // Hide concept disclaimer for README previews
    document.getElementById('concept-banner')?.remove();
    document.body.classList.remove('has-concept-banner');
    document.documentElement.style.setProperty('--concept-banner-height', '0px');

    document.body.classList.add('is-ready');
    document.querySelectorAll('.hero-split, .hero-anim').forEach((el) => {
      el.classList.add('is-in');
    });
    document.querySelectorAll('.reveal, .reveal-in').forEach((el) => {
      el.classList.add('is-visible');
    });
  });
}

async function scrollTo(page, target) {
  if (!target || target === 0) {
    await page.evaluate(() => window.scrollTo(0, 0));
    return;
  }
  await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ block: 'start' });
  }, target);
}

await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('.hero-display', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));
  await preparePage(page);
  await scrollTo(page, shot.scrollTo);
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({
    path: path.join(OUT_DIR, `${shot.name}.png`),
    fullPage: shot.fullPage,
    type: 'png',
  });

  console.log(`Saved ${shot.name}.png`);
}

await browser.close();
console.log('Done.');
