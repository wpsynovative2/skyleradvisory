# Skyler Advisory

The Skyler Real Estate Advisory website, rebuilt from the WordPress original on
Next.js 16 (App Router), TypeScript and Tailwind CSS v4.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm start            # serve the production build
npm run lint         # eslint
```

Form submissions need one extra step — see
[Google Sheets + email setup](./google-apps-script/README.md).

---

## Editing content

**All copy lives in `data/*.json`.** Change the text there and it updates on the
site — no component edits needed.

| File | What it controls |
| --- | --- |
| `site.json` | Company name, logo, nav items, phone, email, address, office hours, WhatsApp, footer credit |
| `hero.json` | Hero headline, subheading, buttons, and the four pillars below it |
| `about.json` | "Driven by Strategy" section and its bullet points |
| `projects.json` | The project cards (name, location, image, description) |
| `market.json` | "Where we operate" — the location chips and the three counters |
| `services.json` | The four service cards and their offering lists |
| `why-choose-us.json` | "Built on Trust" points |
| `process.json` | The four mandate-execution steps |
| `values.json` | Integrity / Accountability / Execution / Growth |
| `team.json` | Team members and the four team counters |
| `mission-vision.json` | Mission and vision statements with their bullet lists |
| `project-support.json` | "Our Role in Projects" list |
| `contact.json` | Contact section copy **and the enquiry form fields** |
| `footer.json` | Footer blurb and link columns |
| `legal.json` | Disclaimer, Privacy Policy, Terms & Conditions |

### Common edits

**Change a phone number or email** — `data/site.json` → `contact.phones` /
`contact.emails`. The header, footer, contact section and floating call button
all read from here.

**Add a project** — add an object to `items` in `data/projects.json`, and drop the
image in `public/images/projects/`:

```json
{
  "slug": "new-project",
  "location": "Borivali (East)",
  "name": "Project Name",
  "image": "/images/projects/new-project.jpg",
  "description": "Description text."
}
```

**Change the statistics** — `data/market.json` → `stats` and `data/team.json` →
`stats`. They count up from zero when scrolled into view.

**Add or change a form field** — `data/contact.json` → `fields`. Supported types
are `text`, `tel`, `email`, `select` (with an `options` array) and `textarea`.
A new field flows through to the Google Sheet automatically, but you also need to
add its column to `HEADERS` and `appendRow` in `google-apps-script/Code.gs`.

> Filenames under `public/` are lowercase and hyphenated. Avoid spaces in new
> image names — they break image URLs.

---

## Project structure

```
app/
  layout.tsx              fonts, metadata, header/footer, providers
  page.tsx                the one-page site — sections in order
  loading.tsx             route-level loader
  api/enquiry/route.ts    validates submissions, forwards to Apps Script
  privacy-policy/ terms-and-conditions/ disclaimer/
components/
  layout/                 Header, Footer, FloatingActions
  sections/               one file per page section
  forms/                  EnquiryForm, EnquiryModal
  ui/                     Loader, Reveal, Counter, Modal, Icon, …
data/                     all site copy as JSON
lib/types.ts              shared types
public/
  images/  fonts/  skyler-brochure.pdf
google-apps-script/       Code.gs + setup guide
```

## Design system

Colours and fonts are defined once in `app/globals.css` under `@theme`, taken
from the original site:

| Token | Value | Used for |
| --- | --- | --- |
| `navy` | `#282360` | Primary brand colour |
| `navy-deep` | `#1b1840` | Dark section backgrounds |
| `gold` | `#ebcd6c` | Accent, highlights, hover states |
| `sand` | `#bc6c25` | Section labels |
| `cream` | `#fefae0` | Alternating section backgrounds |

Type: **Jost** for UI, **Baskervville** for display headings, **DM Sans** for
labels. `Monari` and `Shunsine` from `public/fonts` are wired up as
`font-brand` / `font-script` and available if you want them for brand flourishes.

## The loader

The four-ring SVG spinner appears in three places:

- **Initial page load** — `components/ui/PageLoader.tsx`, a full-screen overlay
  that clears on the window `load` event (with a 4s ceiling so a slow asset can
  never trap a visitor).
- **Route transitions** — `app/loading.tsx`.
- **Form submission** — inside the submit button while an enquiry is sending.

Use it anywhere with `<Loader />`. Variants: `brand` (navy/gold, the default),
`light` (for dark backgrounds), `default` (the original greyscale).

## Accessibility & behaviour notes

- All animation is disabled under `prefers-reduced-motion`.
- The disclaimer gate is acknowledged once per browser (`localStorage`).
- The enquiry form has a honeypot field and server-side validation on name,
  phone, email and consent.
- Section anchors (`#about-us`, `#our-projects`, …) match the original URLs, so
  existing links keep working.
