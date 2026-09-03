# overpowercardgame.com

Static Astro site replacing the WordPress + Elementor build. Deployed by Cloudflare
Pages on every push to `main`.

The Shopify store at **store.overpowercardgame.com is a separate system** and is not
part of this repo. Nothing here touches products, checkout, inventory or fulfilment.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output into dist/
npm run preview  # serve the built output
```

Node 22 (see `.nvmrc`).

---

## Getting it deployed — the two steps that need your accounts

Everything below this line is done. These two steps need credentials I don't have.

### 1. Push to GitHub

```bash
git init && git add -A && git commit -m "Phase 0: Astro scaffold"
gh repo create overpower-site --private --source=. --push
# or create the repo in the GitHub UI and:
# git remote add origin git@github.com:<you>/overpower-site.git && git push -u origin main
```

### 2. Connect Cloudflare Pages

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (env var `NODE_VERSION`) |

First deploy lands on `https://<project>.pages.dev`. **Do not add the custom domain
yet** — that is Phase 5. Until then, update `site` in `astro.config.mjs` to the real
`pages.dev` URL so canonical tags and the sitemap don't point at the live WordPress site.

---

## Layout of the repo

```
src/
  content.config.ts     Collection schemas: news, errata, venues
  content/
    news/               One .md per post — 89 arrive with the Phase 1 import
    errata/errata.json  Rulings, keyed by their original WordPress anchor
    venues/venues.json  Play Network directory
  layouts/              Base (head/SEO), Post
  components/           Header, Footer, Stub
  pages/
    [...slug].astro     Posts at the site root — /designing-overpower/
    news/index.astro    Filterable archive
    errata.astro        Search + slot filter, print stylesheet
    play.astro          Venue table
    *.astro             Phase 2 stubs — real routes, copy outstanding
  styles/
    tokens.css          ← the only file to touch to rebrand
    global.css
public/
  _redirects            5 Cloudflare rules. The 89 posts need none.
functions/
  contact.js            Pages Function scaffold for the forms
```

### Why posts live at the site root

WordPress serves them at `/{slug}/` with no date or category prefix. `[...slug].astro`
reproduces that exactly, which is what removes the need for 89 redirects at cutover.
**Don't move posts under `/news/`** — that would turn a zero-redirect migration into an
89-redirect one.

---

## Branding

`src/styles/tokens.css` holds every colour, typeface and spacing value. Three entries
are marked `SWAP` — they are educated placeholders standing in until the real brand
values are dropped in:

```css
--brand-red:      #D01C2E;
--brand-red-lift: #F03248;
--brand-gold:     #E5B23C;
```

The site is dark-first, which suits card art. To flip it light, swap `--ground` and
`--ink` in that file; nothing else needs to change.

Type is Saira Condensed (display) + Archivo (body) + Roboto Mono (data), loaded from
Google Fonts in `Base.astro`.

---

## Outstanding

**Phase 1 — content import**
- [ ] WordPress export XML → 89 Markdown files in `src/content/news/`
- [ ] Pull every asset out of `/wp-content/uploads/` before WordPress is switched off

**Phase 2 — page rebuilds**
- [ ] Nine stub pages need copy (each one lists what it's waiting on)
- [ ] Plugin audit: anything doing email capture, popups, analytics or redirects
- [ ] Wire `functions/contact.js` to a real inbox and add Turnstile

**Phase 3 — data pages**
- [ ] Card data source for the 472-card gallery
- [ ] Errata: real entries, each keeping its original anchor id
- [ ] Play Network: real venues

**Phase 4 — store**
- [ ] Shopify Storefront Web Components on Quickstart and the Beginners Guide

**Phase 5 — cutover**
- [ ] Sveltia CMS + two editor accounts
- [ ] `site` → `https://overpowercardgame.com`, custom domain, DNS
- [ ] Resubmit sitemap in Search Console
