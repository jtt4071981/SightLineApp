import { chromium } from "playwright";

const executablePath =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";

const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto("file:///workspace/.grok/og-card.html", { waitUntil: "networkidle" });
const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const cs = getComputedStyle(h1);
  const r = h1.getBoundingClientRect();
  const lock = document.querySelector(".lockup").getBoundingClientRect();
  return {
    font: cs.fontFamily,
    weight: cs.fontWeight,
    size: cs.fontSize,
    text: h1.textContent,
    h1: { x: r.x, y: r.y, w: r.width, h: r.height },
    lock: { x: lock.x, y: lock.y, w: lock.width, h: lock.height },
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "/workspace/.grok/og-card.png", type: "png" });

const fav = await browser.newPage({
  viewport: { width: 256, height: 256 },
  deviceScaleFactor: 1,
});
await fav.goto("file:///workspace/.grok/favicon.svg", { waitUntil: "networkidle" });
await fav.screenshot({ path: "/workspace/.grok/favicon-256.png", type: "png" });

const tiny = await browser.newPage({
  viewport: { width: 32, height: 32 },
  deviceScaleFactor: 4,
});
await tiny.goto("file:///workspace/.grok/favicon.svg", { waitUntil: "networkidle" });
await tiny.screenshot({ path: "/workspace/.grok/favicon-32.png", type: "png" });

await browser.close();
