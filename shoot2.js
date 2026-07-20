const puppeteer = require('puppeteer-core');
const CHROME_PATH = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`;
const OUT_DIR = process.argv[2];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--window-size=1600,1000', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3002/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Force past the pinned hero by scrolling in many small real increments
  for (let i = 0; i < 60; i++) {
    await page.evaluate(() => window.scrollBy(0, 150));
    await new Promise((r) => setTimeout(r, 40));
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUT_DIR}/after-scroll-1.png` });

  for (let i = 0; i < 60; i++) {
    await page.evaluate(() => window.scrollBy(0, 150));
    await new Promise((r) => setTimeout(r, 40));
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${OUT_DIR}/after-scroll-2.png` });

  for (const id of ['appartements', 'galerie', 'a-propos']) {
    await page.evaluate((sel) => {
      const el = document.querySelector('#' + sel);
      el?.scrollIntoView({ block: 'start' });
    }, id);
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: `${OUT_DIR}/final-${id}.png` });
  }

  await browser.close();
  console.log('done');
}
main().catch((e) => { console.error(e); process.exit(1); });
