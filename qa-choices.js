const puppeteer = require('puppeteer');
const url = 'https://troncho111.github.io/zoharik-gift/';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2, isMobile: true });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // click main CTA to reach choices
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button, a, .btn-primary')].find(el => /אפשרויות|בואו/.test(el.innerText || ''));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'qa-choices-mobile.png', fullPage: true });

  // verify site links
  const links = await page.$$eval('a.site-link', els => els.map(e => ({ href: e.href, text: e.innerText.trim() })));
  console.log('Site links on choices page:', JSON.stringify(links, null, 2));

  await browser.close();
})();
