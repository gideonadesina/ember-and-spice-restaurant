const fs = require("fs");
const assert = require("assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.argv[2] || "http://127.0.0.1:4173",
  label = process.argv[3] || "local";
(async () => {
  const b = await chromium.launch({
    headless: true,
    args: process.env.QA_HOST_RULES
      ? ["--host-resolver-rules=" + process.env.QA_HOST_RULES]
      : [],
  });
  const context = await b.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const p = await context.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const pageStatus = [];
  for (const file of [
    "index.html",
    "about.html",
    "services.html",
    "contact.html",
  ]) {
    const r = await p.goto(base + "/" + file, {
      waitUntil: "domcontentloaded",
    });
    assert.equal(r.status(), 200);
    assert.equal(await p.locator("h1").count(), 1);
    pageStatus.push({ file, status: r.status() });
  }
  const assets = [
    "css/style.css",
    "js/main.js",
    "assets/favicon.svg",
    ...fs
      .readdirSync("assets/images")
      .filter((f) => f.endsWith(".webp"))
      .map((f) => "assets/images/" + f),
  ];
  for (const file of assets) {
    const r = await context.request.get(base + "/" + file);
    assert.equal(r.status(), 200, file);
  }
  const map = { src: await p.locator("iframe").getAttribute("src") };
  assert.match(map.src, /Ado-Ekiti/);
  const frame = await p.locator("iframe").contentFrame();
  try {
    await frame.locator("body").waitFor({ timeout: 25000 });
    map.bodyVisible = true;
    map.text = (await frame.locator("body").innerText({ timeout: 5000 })).slice(
      0,
      300,
    );
  } catch {
    map.bodyVisible = false;
  }
  await p.goto(base + "/index.html", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1800);
  assert.equal(
    await p.locator(".hero-copy").evaluate((e) => getComputedStyle(e).opacity),
    "1",
  );
  await p.locator("#welcome").scrollIntoViewIfNeeded();
  await p.waitForTimeout(1000);
  const revealOpacity = await p
    .locator("#welcome .reveal")
    .first()
    .evaluate((e) => getComputedStyle(e).opacity);
  assert.equal(revealOpacity, "1");
  await p.locator(".theme-toggle").click();
  await p.waitForTimeout(400);
  const colours = await p
    .locator(".nav-book")
    .evaluate((e) => ({
      text: getComputedStyle(e).color,
      background: getComputedStyle(e).backgroundColor,
    }));
  function luminance(rgb) {
    const c = rgb
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
      .map((v) => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  const x = luminance(colours.text),
    y = luminance(colours.background),
    contrast = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  assert.ok(contrast >= 4.5);
  await p.screenshot({
    path: `qa/screenshots/${label}-light-theme-1440.png`,
    fullPage: true,
  });
  const blocked = await b.newContext();
  await blocked.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value: () => {
        throw new Error("Storage disabled");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new Error("Storage disabled");
      },
    });
  });
  const q = await blocked.newPage();
  q.on("pageerror", (e) => errors.push(e.message));
  await q.goto(base + "/index.html", { waitUntil: "domcontentloaded" });
  await q.locator(".theme-toggle").click();
  assert.equal(await q.locator("html").getAttribute("data-theme"), "light");
  assert.equal(errors.length, 0);
  const result = {
    base,
    label,
    unauthenticatedContext: true,
    pageStatus,
    assetsChecked: assets.length,
    map,
    normalMotionRevealOpacity: revealOpacity,
    lightButtonContrast: Number(contrast.toFixed(2)),
    blockedStorageThemePassed: true,
    errors,
  };
  fs.writeFileSync(
    `qa/${label}-smoke-results.json`,
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
