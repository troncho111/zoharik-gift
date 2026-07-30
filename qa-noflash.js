const puppeteer = require('puppeteer');
const url = 'https://troncho111.github.io/zoharik-gift/?nocache=' + Date.now();

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2, isMobile: false });

  // Disable cache to force a fresh load
  await page.setCacheEnabled(false);

  // start nav but don't await yet — we want to capture early frames
  const navPromise = page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Take screenshots at multiple times during load
  const targetTimes = [400, 800, 1100, 1400, 1700, 2200, 3000];
  const start = Date.now();
  for (const t of targetTimes) {
    const remaining = t - (Date.now() - start);
    if (remaining > 0) await new Promise(r => setTimeout(r, remaining));
    try {
      await page.screenshot({ path: `qa-noflash-${String(t).padStart(4, '0')}ms.png` });
    } catch (e) { console.log(`Skipped ${t}ms (page transitioning)`); }
  }

  await navPromise.catch(() => {});

  // Final: check if amount text "1,000" is visible at all (it shouldn't be, behind canvas)
  const visibleCheck = await page.evaluate(() => {
    const amountEl = document.querySelector('.amount-badge .amount');
    const cs = window.getComputedStyle(amountEl);
    return {
      visibility: cs.visibility,
      hasReady: document.getElementById('amountBadge').classList.contains('ready'),
      canvasExists: !!document.getElementById('scratchCanvas'),
      canvasOpacity: document.getElementById('scratchCanvas') ? window.getComputedStyle(document.getElementById('scratchCanvas')).opacity : null
    };
  });
  console.log('Final state:', visibleCheck);

  await browser.close();
})();
