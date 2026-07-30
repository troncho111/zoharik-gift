const puppeteer = require('puppeteer');
const url = 'https://troncho111.github.io/zoharik-gift/';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2, isMobile: true });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'qa-e2e-01-welcome.png' });

  // Click the main CTA "בואו נראה את האפשרויות"
  const cta = await page.evaluateHandle(() => {
    return [...document.querySelectorAll('button, a, .btn, .cta')].find(el => /אפשרויות|בואו/.test(el.innerText || ''));
  });
  if (cta && cta.asElement()) {
    await cta.asElement().click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'qa-e2e-02-step2-choices.png' });

    // Try clicking HTZ option
    const htz = await page.evaluateHandle(() => {
      return [...document.querySelectorAll('button, a, .option, .choice, [data-option]')].find(el => /HTZ|Hi-Tech/.test(el.innerText || ''));
    });
    if (htz && htz.asElement()) {
      await htz.asElement().click();
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: 'qa-e2e-03-htz-selected.png' });
    }

    // Look for WhatsApp link
    const waLinks = await page.$$eval('a[href*="wa.me"], a[href*="whatsapp"]', els => els.map(e => e.href));
    console.log('WhatsApp links found:', waLinks);
  } else {
    console.log('Welcome CTA not found');
  }

  await browser.close();
  console.log('E2E flow screenshots saved');
})();
