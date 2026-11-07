# Explain and defend Ember & Spice

This guide describes the finished implementation, not a proposed design. Line ranges refer to this version; later edits can move lines. Use your editor's search to find the exact selector or function. The original brief used Jos; the owner's later direction changed the setting to Ado-Ekiti. The time zone remains Africa/Lagos.

## 1. A 30-second introduction

“Ember & Spice is a fictional premium Nigerian grill set in Ado-Ekiti. I wanted the website to feel warm and welcoming while making it easy to explore food, learn the restaurant story and practise an enquiry. It has four separate HTML pages, one shared CSS file and one main JavaScript file. I used Flexbox for rows and alignment, Grid for repeated cards and the gallery, and media queries for mobile layouts. The contact form demonstrates validation; it does not send messages.”

Development was AI-assisted. Be honest about that, and explain the code you have studied rather than claiming it was all manually written.

## 2. Semantic HTML: structure with meaning

Every document starts with a doctype, language, head metadata and body. The head loads CSS and deferred scripts. A single h1 identifies each page. Headings, paragraphs, images with alt text and normal links structure its content.

| Element | Actual example | Purpose |
| --- | --- | --- |
| header | index.html:58 | Shared sticky header |
| nav | index.html:68 | Main navigation, labelled for assistive technology |
| main | index.html:96 | The page's main content; skip-link destination |
| section | index.html:98 | Group related content with a heading |
| article | services.html:164 | A self-contained dish or service |
| aside | about.html:221 | Supporting concept statistics; contact details use aside too |
| figure/figcaption | index.html:257 | Group a photo or quotation with its caption |
| ol/li | about.html:189 | Numbered objectives |
| dl/dt/dd | contact.html:123 | Contact labels and their details |
| form/label/input/textarea | contact.html:178 | Labelled enquiry fields |
| footer | index.html:364 | Shared links, hours and demonstration notice |

Buttons perform actions. Links take you somewhere. The mobile button updates aria-expanded, current-page links use aria-current, fields reference their errors through aria-describedby, and error/success announcements use live regions. Width and height attributes reserve image space; loading="lazy" defers below-the-fold photos.

## 3. External CSS and the design system

Each page contains this line in its head:

```html
<link rel="stylesheet" href="css/style.css" />
```

The main design is in css/style.css. Additional CDN styles belong only to Swiper and Phosphor; they do not implement the assignment's layout. The :root block holds reusable colours, fonts, spacing-related container values and corner radius. The [data-theme="light"] block replaces colour values, so the same components work in both themes. box-sizing: border-box includes borders and padding in declared sizes.

Selector examples to point out:

- Descendant: .food-card p selects paragraphs inside cards.
- Child: .main-nav > a selects direct navigation links.
- Adjacent sibling: h2 + p styles a paragraph immediately after a heading; .about-stats > div + div draws separators.
- General sibling: .form-field [aria-invalid="true"] ~ .field-error styles an error after an invalid field.
- Pseudo-classes: :hover, :focus-visible, :first-child and :nth-child.
- Attribute selectors: [hidden], [data-theme="light"] and [aria-current].

The header is position: sticky. The hero is a relative positioning parent; its photograph, gradient and badge overlays use absolute positioning. The back-to-top button is fixed. Images use object-fit: cover and declared aspect ratios to crop consistently. The gradient keeps cream text readable over photography.

## 4. Every Flexbox declaration

Flexbox arranges items along one main axis. The table includes inline-flex helpers and declarations inside media queries, not only the large sections. Media-query entries can repeat a selector because its behaviour changes at a breakpoint.

| Selector | Source range | Why Flexbox fits |
| --- | --- | --- |
| `.button` | css/style.css:145–161 | Align the label and arrow in one row. |
| `.text-link` | css/style.css:178–186 | Keep link text and its arrow together. |
| `.icon-button` | css/style.css:187–197 | Centre a symbol horizontally and vertically. |
| `.nav-wrap` | css/style.css:218–224 | Place the brand, navigation and actions across the header. |
| `.brand` | css/style.css:225–233 | Keep the brand symbol and wordmark together. |
| `.nav-actions` | css/style.css:250–254 | Group the theme, booking and hamburger controls. |
| `.main-nav.is-open` | css/style.css:273–277 | Stack the expanded mobile navigation links. |
| `.footer-top` | css/style.css:312–317 | Arrange footer groups in columns, then stack them on phones. |
| `.footer-bottom` | css/style.css:342–349 | Separate the copyright and demonstration notice. |
| `.hero-inner` | css/style.css:398–404 | Align the headline block and circular seal across the hero. |
| `.hero-actions` | css/style.css:424–429 | Let the two calls to action wrap on narrow screens. |
| `.hero-bottom` | css/style.css:461–467 | Separate the location note from the scroll link. |
| `.flavour-strip` | css/style.css:481–489 | Distribute short food-philosophy phrases across a strip. |
| `.story-split` | css/style.css:503–508 | Stack image and copy on phones, then place them side by side. |
| `.section-heading` | css/style.css:546–552 | Align a heading with a supporting link or description. |
| `.dish-title` | css/style.css:590–596 | Place a dish name beside its price. |
| `.quote-controls` | css/style.css:680–686 | Centre the previous button, counter and next button. |
| `.page-intro` | css/style.css:702–707 | Pair a large title with supporting copy on desktop. |
| `.photo-caption` | css/style.css:723–737 | Place two photo labels at opposite ends. |
| `.menu-filters` | css/style.css:831–835 | Wrap filter buttons without clipping at mobile widths. |
| `.menu-note` | css/style.css:883–890 | Place the decorative mark beside the note. |
| `.services-flex` | css/style.css:905–909 | Arrange the three event services in an equal row on desktop. |
| `.service-card` | css/style.css:910–918 | Stack card contents and align its link at the bottom. |
| `.nav-book` | css/style.css:1132–1134 | Align related elements along one axis. |
| `.main-nav` | css/style.css:1216–1223 | Arrange desktop navigation links horizontally. |
| `.hero-seal` | css/style.css:1239–1241 | Centre and stack the circular emblem contents. |
| `.menu-toolbar` | css/style.css:1293–1298 | Align filters and the result count on desktop. |

flex-direction changes between column and row; gap separates items; justify-content distributes them along the main axis; align-items aligns the cross axis. flex-wrap lets filters and buttons use another line instead of overflowing.

## 5. Every CSS Grid declaration

Grid controls rows and columns together. Each grid explicitly declares grid-template-columns, grid-template-rows and gap. Later media-query rules change column counts without duplicating content.

| Selector | Source range | Why Grid fits |
| --- | --- | --- |
| `.signature-grid` | css/style.css:559–564 | Three aligned food cards on larger screens. |
| `.gallery-grid` | css/style.css:614–619 | An asymmetric two-dimensional photo arrangement; the first photo spans two rows. |
| `.values-grid` | css/style.css:741–746 | Place mission and vision in equal columns. |
| `.about-stats` | css/style.css:793–801 | Align three numerical concept facts. |
| `.menu-grid` | css/style.css:862–867 | Repeat equal-width dish cards across rows and columns. |
| `.contact-layout` | css/style.css:943–948 | Balance the contact information and enquiry form in two columns. |

The menu uses one column by default, two from 600px and three from 900px. repeat(3, minmax(0, 1fr)) means three equal tracks that can shrink without their contents forcing horizontal overflow. The gallery's first figure spans grid-row: 1 / 3 on larger screens.

## 6. Mobile-first media queries

| Query | Source | Changes |
| --- | --- | --- |
| Default below 600px | Base rules | Stacked sections, one-column grids, hamburger navigation, wrapped filters |
| min-width: 600px | css/style.css:1125 | Wider gutters, visible header booking link, three signature cards, two menu columns, asymmetric gallery, two value columns and three stat columns |
| min-width: 900px | css/style.css:1215 | Desktop navigation, side-by-side story and contact layouts, three menu columns, horizontal services and hero seal |
| min-width: 1200px | css/style.css:1307 | More generous section spacing, larger gallery rows and adjusted hero/form spacing |
| prefers-reduced-motion: reduce | css/style.css:1348 | Remove smooth scrolling and nearly all transitions; JS also skips GSAP and Lenis |

Demo: open browser DevTools, enable device mode, and enter 360, 390, 768, 1024 and 1440 pixels. The hamburger becomes desktop links at 900px. Watch the menu change from one to two to three columns. Check document.documentElement.scrollWidth <= innerWidth in the console.

## 7. Every JavaScript feature

All website logic is in js/main.js, loaded with defer so the HTML exists before it runs. const stores values that will not be reassigned; let is used for values such as the visible dish count and error string that change. Named functions divide the code into understandable jobs.

| Feature | Functions and locations | Events / simple explanation |
| --- | --- | --- |
| Mobile menu | initNavigation, closeMenu — js/main.js:3–36 | click toggles the open class and aria-expanded; Escape, outside click and breakpoint change close it |
| Theme | initTheme, applyTheme — js/main.js:40–72 | click changes html's data-theme; localStorage read/write uses try/catch so privacy restrictions cannot break the page |
| Opening badge | updateOpeningStatus — js/main.js:75–96 | Runs initially and every 60 seconds; Intl.DateTimeFormat gets Africa/Lagos weekday/hour; Tue–Sun 12:00–21:59 is open |
| Menu filters | initMenuFilters — js/main.js:99–123 | click compares each card's data-category with the chosen data-filter and updates hidden, aria-pressed and the result count |
| Back to top | initBackToTop, updateButton — js/main.js:126–141 | Passive scroll listener shows the button after 500px; click scrolls up |
| Contact validation | initContactForm, validateField, updateCharacterCount — js/main.js:152–241 | blur validates a field; input updates feedback/counter; submit validates all fields and displays honest demo success |
| Testimonials | initTestimonials, showQuote — js/main.js:245–288 | Swiper controls change quotes and update the counter; a small manual fallback is available if the CDN fails |
| Animation and scrolling | initMotion, animateScroll — js/main.js:290–330 | GSAP animates the hero; ScrollTrigger reveals sections on scroll; Lenis smooths wheel scrolling on fine-pointer devices; reduced-motion preference skips them |
| Footer year | js/main.js:147 | Sets the displayed year from the browser's current date |

External libraries are enhancements. They do not implement Grid, Flexbox, media queries, menu filtering or form validation. Their exact versions are pinned in each page's head. Google Fonts is a font service, not a layout framework.

## 8. Contact validation: what to show live

The form uses novalidate so the custom inline messages can be demonstrated consistently. HTML still declares required, input types, minlength and maxlength. validateField trims whitespace, checks a rule, writes the corresponding error and updates aria-invalid. CSS gives false a green border and true a red border; error text means colour is not the only signal.

| Field | Rule | Demo input |
| --- | --- | --- |
| Full name | Required, at least 2 characters | A fails; Ada passes |
| Email | Required, non-space text around @ and a dot after it | ada@ fails; ada@example.com passes |
| Subject | Required, at least 3 characters | Hi fails; Dinner passes |
| Message | Required, at least 10 characters, maximum 1,000 | Hello fails; Could we plan a dinner for four? passes |

Names and subjects are capped at 120 characters, email at 254. The email regex checks basic format, not mailbox existence. Do not claim it verifies that the address receives mail.

1. Submit the empty form: four errors appear and the name field receives focus.
2. Type one name character and blur the field: the minimum-length message appears.
3. Enter a malformed email, short subject and short message; show each error.
4. Correct them; show green borders and the message counter changing.
5. Submit valid sample details. The success panel says the message passed validation and **no message was actually sent**. The fields and counter reset.

event.preventDefault() prevents a normal form navigation. Every field is checked using fields.map(validateField), even when an earlier field fails. textContent inserts the name safely as text. There is no fetch call, mail server, stored message, payment or booking backend.

## 9. Real Git history and a change you can make yourself

Meaningful milestones were committed as features were completed: setup, navigation, homepage, about, menu, contact, interactions, validation, libraries, responsiveness, formatting, photographs, requested copy/location changes and QA fixes. These are real commits, not backdated or fabricated history.

```sh
git log --oneline
git status
git diff
```

git log shows history. git status lists changed files. git diff shows the actual edits.

Try changing the short welcome paragraph in index.html. Save it, refresh the local site and check mobile layout. Then run:

```sh
git diff -- index.html
git add index.html
git commit -m "Personalise the restaurant welcome message"
git push origin main
```

add stages only the chosen file; commit saves a named snapshot; push uploads it. Open GitHub to check the new commit, then Vercel to check the automatic production deployment. Refresh the public website only after the deployment is Ready. Never commit credentials or .vercel.

## 10. Deployment

The public repository is https://github.com/gideonadesina/ember-and-spice-restaurant. The Vercel production URL is https://ember-and-spice-restaurant-sepia.vercel.app.

Vercel is lecturer-approved. The project is linked to GitHub and main is the production branch. Framework is Other/null, build command is empty, output is the root directory (.). vercel.json records that configuration. Vercel serves the HTML, CSS, JavaScript and photos as static files. Deployment protection was checked separately so the lecturer can visit without authentication. QA.md records the executed production checks; do not infer them solely from a successful upload.

## 11. Ten likely questions

1. **Why semantic HTML?** It gives content meaning and helps browsers, screen readers and readers understand the structure.
2. **Why external CSS?** One shared file keeps all pages consistent and makes a change apply everywhere.
3. **Grid versus Flexbox?** Flexbox aligns items mainly along one axis; Grid manages rows and columns together.
4. **What makes it responsive?** Flexible widths, wrapping, scalable typography and mobile-first media queries.
5. **What is the box model?** Content, padding, border and margin; border-box includes padding and border within the specified width.
6. **What does preventDefault do?** It stops normal form submission so JavaScript can show validation feedback without leaving the page.
7. **Does the form send email?** No. It validates inputs, clearly explains the demo and resets the form.
8. **What is localStorage used for?** Only the colour-theme preference. Form messages are not saved.
9. **How do you know the site works?** Playwright exercised layouts, images and interactions locally and separately on production; QA.md preserves actual results and limitations.
10. **How do updates go live?** Make a real change, commit it and push main; the GitHub-linked Vercel project deploys it.

## 12. Five-minute presentation

| Time | Demonstrate |
| --- | --- |
| 0:00–0:30 | Deliver the introduction; identify the fictional business and honest demo content |
| 0:30–1:15 | Walk through Home and About, pointing out the gallery, story, mission and objectives |
| 1:15–2:00 | Open Menu; use filters, show the card grid and event services; identify Grid and Flexbox selectors |
| 2:00–2:45 | Resize to 360px, open/close the hamburger, switch themes and explain the 600/900/1200px queries |
| 2:45–3:45 | Demonstrate empty form, malformed email, minimum lengths, counter and valid honest success |
| 3:45–4:20 | Open the source; show semantic tags, the stylesheet link and validateField |
| 4:20–5:00 | Show actual Git commits, the public repository, Vercel URL and the small-change workflow |

Keep a local copy open in case the venue's internet blocks fonts, the map or CDN enhancements. Explain any external-network limitation honestly. Read SUBMISSION.md for personal fields and the final checklist.
