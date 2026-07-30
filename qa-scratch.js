const puppeteer = require('puppeteer');
const url = 'https://troncho111.github.io/zoharik-gift/';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2, isMobile: false });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  // Screenshot 1: covered (before scratch)
  await page.screenshot({ path: 'qa-scratch-01-covered.png' });

  // Verify canvas exists and has content
  const canvasInfo = await page.evaluate(() => {
    const c = document.getElementById('scratchCanvas');
    if (!c) return { exists: false };
    return { exists: true, width: c.width, height: c.height, displayed: c.offsetWidth > 0 };
  });
  console.log('Canvas info:', canvasInfo);

  // Simulate scratching - drag back and forth across the canvas multiple times
  const box = await page.evaluate(() => {
    const c = document.getElementById('scratchCanvas');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  });
  console.log('Canvas box:', box);

  // do a zig-zag drag across the canvas
  const startX = box.x + 10;
  const startY = box.y + box.height / 2;
  const endX = box.x + box.width - 10;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  // 4 passes
  for (let pass = 0; pass < 5; pass++) {
    const yOffset = (pass - 2) * (box.height / 6);
    const steps = 20;
    for (let s = 0; s <= steps; s++) {
      const x = startX + (endX - startX) * (pass % 2 === 0 ? s / steps : 1 - s / steps);
      await page.mouse.move(x, startY + yOffset);
    }
  }
  await page.mouse.up();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'qa-scratch-02-revealed.png' });

  // Check revealed state
  const revealedInfo = await page.evaluate(() => {
    const c = document.getElementById('scratchCanvas');
    const badge = document.getElementById('amountBadge');
    return {
      canvasGone: !c || c.classList.contains('revealed'),
      badgeRevealed: badge.classList.contains('revealed')
    };
  });
  console.log('After scratch:', revealedInfo);

  await browser.close();
})();
