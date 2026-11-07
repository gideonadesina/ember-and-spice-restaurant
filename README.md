# Ember & Spice

A fictional premium Nigerian grill, now set in **Ado-Ekiti, Ekiti State**, following the project owner's updated direction. Four responsive pages built with semantic HTML, handwritten CSS and vanilla JavaScript. No framework, bundler or build step.

- **Live website:** https://ember-and-spice-restaurant-sepia.vercel.app
- **Public repository:** https://github.com/gideonadesina/ember-and-spice-restaurant
- **Hosting platform:** Vercel (approved by the lecturer)

## Student information

Full name: **Adesina Gideon Ayodele**  
Matric number: **202660167091GH**  
Department: **Computer Science**  
Course: **COM 105**

## Pages and features

| Page | Contents |
| --- | --- |
| `index.html` | Photo hero, welcome, signature dishes, asymmetric gallery, sample guest-quote carousel and enquiry links |
| `about.html` | Background, mission, vision, objectives and CSS Grid concept statistics |
| `services.html` | Six illustrated dishes; All, Grills & bites, Rice, Soups and Drinks filters; catering, events and private dining |
| `contact.html` | Sample contact information, opening hours, Ado-Ekiti Google Maps iframe and accessible demo enquiry form |

Shared features: sticky Flexbox navigation, mobile hamburger menu with Escape support, current-page indicator, keyboard focus styling, skip link, saved dark/light theme, live WAT opening status, back-to-top control and reduced-motion support.

The form checks required fields, an email regex and name/subject/message minimum lengths of 2/3/10 characters. It validates on blur and submit, shows inline errors and red/green field states, counts message characters, focuses the first error and resets after success. **No message is sent or stored and no reservation is made.**

## Technologies

- HTML5; one main external stylesheet, `css/style.css`; one main handwritten script, `js/main.js`.
- CSS3 variables, box model, combinators, pseudo-classes, positioning, handwritten Flexbox and CSS Grid.
- Mobile-first queries at 600, 900 and 1200 px, plus `prefers-reduced-motion`.
- Pinned CDN enhancements: GSAP **3.12.5** and ScrollTrigger, Swiper **11.2.10**, Lenis **1.1.20**, Phosphor Icons **2.1.1**.
- Google Fonts: Playfair Display and DM Sans, with Georgia/Arial fallbacks and font preconnections.
- Ten local WebP photos, all under 300 KB, with declared dimensions and lazy loading below the fold.
- Page-specific titles/descriptions, Open Graph metadata and an SVG favicon.

Core layout, navigation, filtering, validation, theme and opening logic do not depend on libraries. Swiper also has a small handwritten fallback.

## Folder structure

```text
index.html
about.html
services.html
contact.html
css/style.css
js/main.js
assets/favicon.svg
assets/images/*.webp
assets/images/credits.json
qa/                         # Development tests and recorded results
vercel.json
README.md
EXPLAIN.md                  # Study guide and five-minute presentation
SUBMISSION.md               # Submission fields and checklist
QA.md                       # Executed checks and limitations
```

Ignored `.tools/` helpers are development tooling, not website code. Credentials are not stored in the project. `.vercel/` and browser screenshots are ignored. QA files are excluded from hosting by `.vercelignore`.

## Run locally

Open `index.html` directly. A static server gives more consistent storage behaviour:

```sh
node qa/serve.cjs
```

Visit `http://127.0.0.1:4173`. The included server uses Node.js, which is already available in this workspace, and no packages. Any static HTTP server also works. The website needs no package installation or build.

For optional development QA, use an existing Playwright installation or install it separately. Set `PLAYWRIGHT_MODULE` to its module path if needed:

```sh
node qa/browser-check.cjs http://localhost:4173 local
node qa/functional-check.cjs http://localhost:4173 local
```

Screenshots cover all pages at 360, 390, 768, 1024 and 1440 px. `QA_HOST_RULES` is an optional browser DNS diagnostic setting used when the development machine's DNS was unreliable. Normal visitors do not need it.

## Deployment

Vercel project: `ember-and-spice-restaurant`, connected to this public GitHub repository. Production branch: `main`. Framework: **Other** (`null`). Build command: **empty**. Output directory: **`.`**. `vercel.json` preserves these settings. Production is intended to be accessible without login; `QA.md` records the actual unauthenticated checks.

Pushes to `main` trigger the connected Vercel production workflow. EXPLAIN.md shows how to make, commit and push a personal edit.

## Photography and demonstration content

Photography: **Unsplash contributors**. Source-image credits for every local file are in `assets/images/credits.json`. The following original source links credit the photographs used:

| Local image | Source |
| --- | --- |
| Hero | [Unsplash grill photograph](https://images.unsplash.com/photo-1544025162-d76694265947) |
| Grill | [Unsplash sliced steak](https://images.unsplash.com/photo-1558030006-450675393462) |
| Rice | [Unsplash seasoned rice](https://images.unsplash.com/photo-1512058564366-18510be2db19) |
| Chicken | [Unsplash chicken](https://images.unsplash.com/photo-1532550907401-a500c9a57435) |
| Soup | [Unsplash soup](https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a) |
| Small chops | [Unsplash samosas](https://images.unsplash.com/photo-1601050690597-df0568f70950) |
| Drink | [Unsplash drinks](https://images.unsplash.com/photo-1544145945-f90425340c7e) |
| Interior | [Unsplash restaurant](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4) |
| Table | [Unsplash dining](https://images.unsplash.com/photo-1414235077428-338989a2e8c0) |
| Kitchen | [Unsplash cooking together](https://images.unsplash.com/photo-1556910103-1c02745aae4d) |

Photos are illustrative stock images, not this fictional restaurant or exact recipes. Contact details, menu prices, concept statistics and guest quotes are demonstration content. The email uses the reserved `.example` domain. The map shows the city, not an operating restaurant. External fonts, CDN enhancements and the map need an internet connection; photography and core logic are local.
