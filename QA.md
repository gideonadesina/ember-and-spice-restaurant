# Executed QA report

Website: https://ember-and-spice-restaurant-sepia.vercel.app  
Repository: https://github.com/gideonadesina/ember-and-spice-restaurant  
Date: 7 November 2026

## Verified results

| Check actually executed | Result |
| --- | --- |
| Local layouts, 4 pages × 5 widths | 20/20 checked at 360, 390, 768, 1024 and 1440px; zero horizontal overflow; all images loaded on the final local run |
| Production layouts, 4 pages × 5 widths | 20/20 checked; zero horizontal overflow; screenshot capture completed for every combination |
| Production image rendering | Initial run had one pending image; all four 360px pages then passed a focused rerun with no broken/pending images |
| Mobile navigation | Open/close, aria-expanded, Escape and a real navigation click passed |
| Functional suite | 14 checks passed locally and separately on production |
| Anonymous public access | All four production pages returned HTTP 200 in a fresh browser context without Vercel login |
| Static production assets | 13 checked: main CSS, main JS, favicon and ten photos; every request returned 200 |
| HTML structure/local links | Four documents passed balanced-tag, duplicate-ID, image-attribute and local-link/anchor checks |
| Photo sizes | Ten WebP photos, about 24–147 KB each; all below 300 KB |
| Contrast | Light-theme primary button measured 7.12:1 after the transition settled |
| Motion | Normal-motion reveal reached full opacity; reduced-motion mode skips GSAP/Lenis |
| Storage restrictions | Theme toggle worked when localStorage getItem/setItem deliberately threw errors |
| Browser JavaScript | No uncaught exceptions in final layout or functional runs |
| Console/network | Final local and production layout runs recorded no console errors and no HTTP 4xx/5xx responses; external map navigations were sometimes aborted when the test moved to another page |
| Automatic deployments | Vercel deployment with source=git and the pushed GitHub commit SHA reached READY; GitHub Vercel status reported success |
| Deployment protection | Project protection set to null and unauthenticated browser access checked separately |

The 14 functional checks cover empty fields, minimum lengths, email format, the message counter, honest valid-submit feedback/reset/no form request, query-string prefill, mobile navigation, five category filters, cross-page theme persistence, next/previous guest quotes, calculated WAT status, back-to-top, loaded pinned libraries and reduced motion.

## Visual inspection

Playwright screenshots were captured locally and on production at every listed width. Four-page overview sheets at 360, 768, 1024 and 1440px were inspected, along with a production 390px hero and light-theme capture. Checks covered alignment, wrapping, spacing, image crops, readability and control visibility. No overlapping content or horizontal layout defects were found. The circular hero seal is intentionally removed on mobile; service cards stack and filters wrap.

Issues fixed during implementation: unavailable source photos, an unsuitable soup/drink photo match, accurate image dimensions, light-theme primary-button contrast and the owner's requested Ekiti location change. Testing also exposed timing issues in the QA scripts; waits now distinguish pending lazy images and in-progress colour transitions from completed rendering.

## Transparent limitations and reruns

Initial production image observation: index.html at 360px: assets/images/grill.webp. The focused production 360px rerun recorded 4/4 pages with all images loaded. Original observations remain in production-layout-results.json; the passing rerun is preserved separately rather than rewriting that evidence.

The development host had intermittent DNS/connection timeouts. Downloads and browser runs used explicitly resolved host addresses through optional QA_HOST_RULES; HTTPS hostname/certificate checks and public URLs were preserved. No authentication bypass token was used for production QA. Site visitors do not need these development-only settings.

The Google Maps iframe and its Ado-Ekiti URL are present, but the external map did not finish rendering reliably in this environment. The visible direct Google Maps link provides a fallback. Do not claim the map tiles passed visual QA.

This is structural HTML checking, not a W3C validation certificate. No Lighthouse score or complete WCAG certification is claimed. Font preconnections, alt text, focus styles, lazy loading, declared image dimensions and compressed assets were checked as practical sanity measures.

## Evidence and rerunning

- qa/local-layout-results.json
- qa/local-functional-results.json
- qa/production-layout-results.json
- qa/production-recheck-360-layout-results.json
- qa/production-functional-results.json
- qa/production-smoke-results.json
- qa/production-map-results.json
- qa/static-results.json
- qa/screenshots/ (local generated PNGs, excluded from Git and hosting)

Run node qa/serve.cjs for a dependency-free local HTTP server. With Playwright available, run the browser, functional and smoke scripts with a base URL and report label. QA_WIDTHS=360 restricts the screenshot suite to a focused mobile rerun. See README for module-path and optional DNS settings.
