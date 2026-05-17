// screenshot.js - יוצר תמונת preview.png מקובץ preview.html
// הרצה: node screenshot.js
// דרישה מקדימה: npm install puppeteer

const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('🚀 מתחיל ליצור preview.png...');

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // 1200x630 הוא הגודל הסטנדרטי של Open Graph
  // deviceScaleFactor: 2 = איכות retina (התמונה הסופית תהיה 2400x1260)
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2
  });

  const previewPath = 'file://' + path.resolve(__dirname, 'preview.html');
  await page.goto(previewPath, { waitUntil: 'networkidle0' });

  // המתנה לטעינת פונטים ואימוג'ים
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({
    path: 'preview.png',
    type: 'png'
  });

  await browser.close();
  console.log('✓ preview.png נוצר בהצלחה!');
  console.log('  ' + path.resolve(__dirname, 'preview.png'));
})();
