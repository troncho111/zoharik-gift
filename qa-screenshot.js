const puppeteer = require("puppeteer");
const fs = require("fs");
const dir = "C:/Users/User/Projects/zoharik-gift/qa-screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

(async () => {
  // Desktop
  {
    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto("https://troncho111.github.io/zoharik-gift/", { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: dir + "/01_desktop.png", fullPage: false });
    // List buttons
    const btns = await page.$$eval("button", els => els.map(e => e.innerText.trim().slice(0,50)));
    console.log("Buttons:", JSON.stringify(btns.slice(0,8)));
    await browser.close();
  }
  // Mobile
  {
    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 915, isMobile: true });
    await page.goto("https://troncho111.github.io/zoharik-gift/", { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: dir + "/02_mobile.png", fullPage: false });
    await browser.close();
  }
  console.log("Done. Screenshots in", dir);
})();
