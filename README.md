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

## Getting it deployed, from nothing

Assumes no GitHub repo, no git installed, no Cloudflare account. About 20 minutes.

**Read this first:** Cloudflare offers a drag-and-drop "Direct Upload" deploy. It is
tempting and it is a trap for this project — **a Direct Upload project can never be
converted to a Git-connected one.** You'd have to delete it and start over. Use it
only under a scratch project name if you want to eyeball the site tonight. The real
project must be created via *Connect to Git*.

### Part A — GitHub (~10 min)

1. **Account.** [github.com/signup](https://github.com/signup) if you don't have one.
2. **Install GitHub Desktop** from [desktop.github.com](https://desktop.github.com).
   It bundles git — nothing else to install, no CLI, no SSH keys, no access tokens.
   Sign in; it authenticates through your browser.
3. **Unzip `overpower-site.zip`** somewhere permanent — Documents, not Downloads.
4. In GitHub Desktop: **File → Add local repository →** select the `overpower-site`
   folder. It is *already* a git repo with two commits in it, so this just works.
   (If you see "this directory does not appear to be a git repository", you selected
   a parent or child folder — pick the one containing `package.json`.)
5. Click **Publish repository**. Name it `overpower-site`, leave **Keep this code
   private** ticked, click Publish.

### Part B — Cloudflare (~10 min)

Cloudflare is a web dashboard — nothing to install. The free plan needs an email and
password and **no credit card**.

1. **Account.** [dash.cloudflare.com](https://dash.cloudflare.com) → Sign up. If
   you've ever put a domain behind Cloudflare, you already have this account.
2. In the left sidebar: **Workers & Pages → Create application → Pages →
   Connect to Git.**
3. Authorize GitHub when prompted. You can scope it to **only** the `overpower-site`
   repo rather than granting access to everything.
4. Select the repo, then set:

   | Setting | Value |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `22` |

5. **Save and Deploy.** First build takes ~2 minutes and lands on
   `https://<project-name>.pages.dev`.

### Part C — one thing to send back

Tell me the `pages.dev` URL. `site` in `astro.config.mjs` is currently a guess, and
it needs to be the real one so canonical tags and the sitemap don't point at the live
WordPress site.

**Do not add the custom domain yet** — that is Phase 5, and we're rehearsing it on a
throwaway domain first.

### After this, the loop is

Edit files → GitHub Desktop shows the changes → write a summary → **Commit to main** →
**Push origin**. Cloudflare rebuilds and redeploys within about a minute. That is the
entire deployment process from here on.

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

---

## Unity demos

The `.gitignore` has a Unity section scoped to a `unity/` folder, so a project
can live here if you want one. Two things to weigh before it does.

**Where the project should live.** Cloudflare clones the whole repo on every
build, and your two non-technical editors will be committing into it through
Sveltia. A Unity project — `Library/`, LFS objects, imported assets — makes
every content edit's deploy slower and puts an engine project in their working
set. Unless the demo is genuinely small, the better shape is a separate repo for
the Unity project, with only the WebGL build output copied into `public/demo/`
here. That also keeps Git LFS out of this repo, which matters because enabling
it is repo-wide and metered.

**Two Cloudflare constraints worth knowing before you build, not after:**

- **25 MiB per file, hard.** Unity's `.data` and `.wasm` routinely exceed that
  uncompressed. Brotli usually brings them under, which is an argument for
  building compressed rather than letting the edge handle it.
- **20,000 files per deployment**, shared with the rest of the site. Not a
  problem for a normal WebGL build; would be for a loose `StreamingAssets` dump.

`public/_headers` already carries the Unity `Content-Encoding` and
`application/wasm` rules, scoped to `/demo/`. Verify them on the first real
deploy — Cloudflare compresses at the edge too, and that interaction is the
most likely thing to break.

**The one that would cost you a day.** If the build uses multithreading
(SharedArrayBuffer), it needs `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`. Applied site-wide, `require-corp`
blocks every cross-origin resource that doesn't send
`Cross-Origin-Resource-Policy: cross-origin` — which breaks the Shopify
Storefront Web Components at Phase 4 and the YouTube embeds for Character
Spotlight. Keep those two headers scoped to `/demo/*`. They're pre-written and
commented out in `public/_headers`.
