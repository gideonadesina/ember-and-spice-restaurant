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
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const p = await context.newPage();
  const passed = [];
  const errors = [];
  p.setDefaultNavigationTimeout(90000);
  p.on("pageerror", (e) => errors.push(e.message));
  async function test(name, fn) {
    await fn();
    passed.push(name);
    console.log("PASS " + name);
  }
  await p.goto(base + "/contact.html", { waitUntil: "domcontentloaded" });
  await test("Empty form: four inline errors and first invalid field focused", async () => {
    await p.locator("[type=submit]").click();
    assert.equal(await p.locator("[aria-invalid=true]").count(), 4);
    assert.equal(
      await p.locator("#name").evaluate((e) => document.activeElement === e),
      true,
    );
  });
  await test("Blur validation and name, subject, message minimum lengths", async () => {
    for (const [id, value] of [
      ["name", "A"],
      ["subject", "Hi"],
      ["message", "Hello"],
    ]) {
      await p.locator("#" + id).fill(value);
      await p.locator("#" + id).blur();
      assert.equal(
        await p.locator("#" + id).getAttribute("aria-invalid"),
        "true",
      );
    }
  });
  await test("Malformed email rejected", async () => {
    await p.locator("#email").fill("not-an-email");
    await p.locator("#email").blur();
    assert.equal(
      await p.locator("#email").getAttribute("aria-invalid"),
      "true",
    );
  });
  await test("Character counter updates live", async () => {
    await p.locator("#message").fill("A message about dinner.");
    assert.equal(
      await p.locator("#message-count").innerText(),
      "23 / 1,000 characters",
    );
  });
  await test("Valid submit: honest demo message, reset and no outgoing form request", async () => {
    const outgoing = [];
    const listener = (r) => {
      if (
        r.method() === "POST" &&
        new URL(r.url()).origin === new URL(base).origin &&
        r.frame() === p.mainFrame()
      )
        outgoing.push(r.url());
    };
    p.on("request", listener);
    await p.locator("#name").fill("Ada Example");
    await p.locator("#email").fill("ada@example.com");
    await p.locator("#subject").fill("Dinner enquiry");
    await p.locator("#message").fill("Could we plan a dinner for four?");
    await p.locator("[type=submit]").click();
    assert.match(
      await p.locator("#form-success").innerText(),
      /Thanks, Ada Example!.*no message was actually sent/,
    );
    assert.equal(await p.locator("#name").inputValue(), "");
    assert.equal(
      await p.locator("#message-count").innerText(),
      "0 / 1,000 characters",
    );
    assert.equal(await p.locator("[aria-invalid]").count(), 0);
    assert.equal(outgoing.length, 0);
    p.off("request", listener);
  });
  await test("Subject prefill from catering link", async () => {
    await p.goto(base + "/contact.html?subject=Catering%20enquiry#enquiry", {
      waitUntil: "domcontentloaded",
    });
    assert.equal(await p.locator("#subject").inputValue(), "Catering enquiry");
  });
  await test("Mobile navigation, Escape and navigation link", async () => {
    await p.locator(".menu-toggle").click();
    assert.equal(
      await p.locator(".menu-toggle").getAttribute("aria-expanded"),
      "true",
    );
    await p.keyboard.press("Escape");
    assert.equal(
      await p.locator(".menu-toggle").getAttribute("aria-expanded"),
      "false",
    );
    await p.locator(".menu-toggle").click();
    await p.locator('.main-nav a[href="services.html"]').click();
    await p.waitForURL("**/services.html");
    assert.equal(
      await p.locator(".main-nav a[aria-current]").innerText(),
      "The menu",
    );
  });
  await test("All five category filters return the expected dishes", async () => {
    for (const [category, count] of [
      ["grills", 3],
      ["rice", 1],
      ["soups", 1],
      ["drinks", 1],
      ["all", 6],
    ]) {
      await p.locator(`[data-filter="${category}"]`).click();
      assert.equal(await p.locator(".menu-card:visible").count(), count);
      assert.equal(
        await p
          .locator(`[data-filter="${category}"]`)
          .getAttribute("aria-pressed"),
        "true",
      );
    }
  });
  await test("Theme persists across pages", async () => {
    await p.locator(".theme-toggle").click();
    assert.equal(await p.locator("html").getAttribute("data-theme"), "light");
    await p.goto(base + "/about.html", { waitUntil: "domcontentloaded" });
    assert.equal(await p.locator("html").getAttribute("data-theme"), "light");
    await p.locator(".theme-toggle").click();
  });
  await p.goto(base + "/index.html", { waitUntil: "domcontentloaded" });
  await test("Testimonial next and previous controls", async () => {
    const first = await p.locator(".quote-count").innerText();
    await p.locator(".quote-next").click();
    assert.notEqual(await p.locator(".quote-count").innerText(), first);
    await p.locator(".quote-prev").click();
    assert.equal(await p.locator(".quote-count").innerText(), first);
  });
  await test("Opening badge has a calculated WAT status", async () => {
    assert.match(
      await p.locator(".opening-status").first().innerText(),
      /^(Open now|Closed).*WAT$/,
    );
  });
  await test("Back-to-top control", async () => {
    await p.evaluate(() => scrollTo(0, 900));
    await p.waitForTimeout(200);
    await p.locator(".back-top").click();
    await p.waitForTimeout(200);
    assert.equal(await p.evaluate(() => scrollY), 0);
  });
  await test("Pinned CDN libraries are loaded", async () => {
    const libraries = await p.evaluate(() => ({
      swiper: typeof Swiper,
      gsap: typeof gsap,
      lenis: typeof Lenis,
      scrollTrigger: typeof ScrollTrigger,
    }));
    assert.deepEqual(libraries, {
      swiper: "function",
      gsap: "object",
      lenis: "function",
      scrollTrigger: "function",
    });
  });
  await test("Reduced motion skips GSAP reveal and Lenis animation", async () => {
    assert.equal(await p.locator(".hero-copy").getAttribute("style"), null);
  });
  assert.equal(errors.length, 0);
  fs.writeFileSync(
    `qa/${label}-functional-results.json`,
    JSON.stringify({ base, label, passed, errors }, null, 2),
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
