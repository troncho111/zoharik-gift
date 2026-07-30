const puppeteer = require('puppeteer');
const url = 'https://troncho111.github.io/zoharik-gift/';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await desktop.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await desktop.screenshot({ path: 'qa-live-desktop.png', fullPage: false });
  const buttons = await desktop.$$eval('button, [role="button"], .choice, .option, a', els => els.map(e => (e.innerText || '').trim()).filter(t => t.length > 0 && t.length < 60));
  console.log('Desktop buttons/labels:', buttons.slice(0, 15));

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 412, height: 915, deviceScaleFactor: 2, isMobile: true });
  await mobile.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await mobile.screenshot({ path: 'qa-live-mobile.png', fullPage: false });

  console.log('OK desktop+mobile screenshots saved');
  await browser.close();
})();
