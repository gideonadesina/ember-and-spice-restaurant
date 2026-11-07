/* Development QA only. Run: node qa/browser-check.cjs http://127.0.0.1:4173 local */
const fs = require("fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.argv[2] || "http://127.0.0.1:4173";
const label = process.argv[3] || "local";
(async () => {
  fs.mkdirSync("qa/screenshots", { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    args: process.env.QA_HOST_RULES
      ? ["--host-resolver-rules=" + process.env.QA_HOST_RULES]
      : [],
  });
  const results = [];
  const errors = [];
  const consoleErrors = [];
  const failedRequests = [];
  const httpErrors = [];
  for (const width of [360, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("requestfailed", (r) =>
      failedRequests.push({ url: r.url(), error: r.failure()?.errorText }),
    );
    page.on("response", (r) => {
      if (r.status() >= 400)
        httpErrors.push({ url: r.url(), status: r.status() });
    });
    for (const file of [
      "index.html",
      "about.html",
      "services.html",
      "contact.html",
    ]) {
      await page.goto(base + "/" + file, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await page.waitForTimeout(900);
      await page.evaluate(async () => {
        document.querySelectorAll("img").forEach((image) => {
          image.loading = "eager";
        });
        await Promise.race([
          Promise.allSettled(
            Array.from(document.images).map((image) => image.decode()),
          ),
          new Promise((resolve) => setTimeout(resolve, 10000)),
        ]);
      });
      await page
        .waitForFunction(
          () =>
            Array.from(document.images).every(
              (image) => image.complete && image.naturalWidth > 0,
            ),
          null,
          { timeout: 20000 },
        )
        .catch(() => {});
      // Trigger lazy-loaded images before recording the complete page.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
      const check = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        brokenImages: Array.from(document.images)
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.getAttribute("src")),
        h1: document.querySelectorAll("h1").length,
        title: document.title,
        navLinks: Array.from(document.querySelectorAll(".main-nav>a")).map(
          (a) => a.getAttribute("href"),
        ),
        layout: {
          menu: getComputedStyle(
            document.querySelector(".menu-grid") || document.body,
          ).display,
        },
      }));
      if (width < 900) {
        await page.locator(".menu-toggle").click();
        if (
          (await page.locator(".menu-toggle").getAttribute("aria-expanded")) !==
          "true"
        )
          throw Error("Mobile toggle failed");
        await page.keyboard.press("Escape");
        if (
          (await page.locator(".menu-toggle").getAttribute("aria-expanded")) !==
          "false"
        )
          throw Error("Escape failed");
      }
      await page.screenshot({
        path: `qa/screenshots/${label}-${file.replace(".html", "")}-${width}.png`,
        fullPage: true,
      });
      results.push({ file, ...check });
      console.log(
        `${label} ${width} ${file}: overflow=${check.scrollWidth > width} brokenImages=${check.brokenImages.length}`,
      );
    }
    await context.close();
  }
  const report = {
    base,
    label,
    date: new Date().toISOString(),
    hostRules: process.env.QA_HOST_RULES || null,
    results,
    errors,
    consoleErrors,
    failedRequests,
    httpErrors,
  };
  fs.writeFileSync(
    `qa/${label}-layout-results.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  if (
    results.some((r) => r.scrollWidth > r.width || r.brokenImages.length) ||
    errors.length
  )
    process.exitCode = 1;
})();
