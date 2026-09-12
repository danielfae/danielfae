# SEO Audit — TODOs

Generated from an audit against `spa-seo-implementation-plan.md`, adapted to this project. This is a **static 2-page HTML site** (no client-side router), hosted on GitHub Pages with a custom domain (`danielfae.com`, see `CNAME`). Because there's no SPA router, Phase 2's client-side meta hook does **not** apply — add meta tags directly into each HTML file's `<head>` instead.

Pick this file up and work through the checklist below. Check items off as they're completed; leave this file in place until everything is done, then it can be deleted.

## Current State Summary

- Pages: `index.html` (homepage), `resume.html`.
- Neither page has a meta description, canonical link, Open Graph tags, or Twitter Card tags — only a `<title>`.
- No `robots.txt` at the repo root.
- No `sitemap.xml` at the repo root (`SITEMAP.md` is human-readable architecture documentation only, not a crawlable sitemap).
- No dedicated `404.html` (GitHub Pages will serve one automatically at the domain root for unknown paths on custom domains if present).
- `index.html` has exactly one `<h1>` ("DANIEL AREVALO"). `resume.html` has exactly one `<h1>` ("Daniel Arevalo"). Good baseline.
- **Heading-level skip found**: in `index.html`, the "Design Process" `<h2>` (`section-header`, ~line 1607) is followed directly by three `<h4>` module-card titles ("User Research", "Quick Prototyping", "Iterative Development", ~lines 1616/1622/1628) with no `<h3>` in between.
- `assets/DanitlPhotoContrast.png` exists but is a profile photo, not a purpose-built 1200×630 OG share image.

## Phase 1 — HTML shell defaults (apply per-file, both pages)

- [x] `index.html`: add `<meta name="description">`
- [x] `index.html`: add `<link rel="canonical" href="https://danielfae.com/">`
- [x] `index.html`: add Open Graph tags (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`)
- [x] `index.html`: add Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [x] `resume.html`: add `<meta name="description">`
- [x] `resume.html`: add `<link rel="canonical" href="https://danielfae.com/resume.html">`
- [x] `resume.html`: add Open Graph tags
- [x] `resume.html`: add Twitter Card tags
- [x] Create a dedicated 1200×630 OG share image (e.g. `assets/og-image.png`) and reference it via an absolute URL in both pages' `og:image` / `twitter:image` — don't reuse the profile photo as-is
- [x] Skip Phase 2 (SPA meta hook) — not applicable, this isn't a client-side-routed SPA

## Phase 3 — robots.txt

- [x] Add `/robots.txt` at the repo root: `User-agent: *`, `Allow: /`, `Sitemap: https://danielfae.com/sitemap.xml`

## Phase 4 — sitemap.xml

- [x] Add `/sitemap.xml` at the repo root listing `/` (priority `1.0`) and `/resume.html` (priority `0.7`) — `projects.html` deliberately left out: it sits behind a password panel
- [x] Reference the sitemap from `robots.txt` (done together with Phase 3 item above)
- [ ] After deploy, submit the sitemap to Google Search Console and Bing Webmaster Tools

## Phase 5 — 404 page

- [x] Add `/404.html` at the repo root (GitHub Pages serves this automatically for unknown paths under a custom domain)
- [x] Single `<h1>` explaining the error, a paragraph, and a link back to `index.html`
- [x] Give it its own `<title>` / description
- [x] Do not list it in `sitemap.xml`

## Phase 6 — Heading hierarchy

- [x] Fix the skip in `index.html`: the "Design Process" section is now "How I Work"; its three module-card `<h4>` titles are `<h3>` (and `.module-card h3` in CSS)
- [ ] Re-check `resume.html`'s tab sections (Experience/Education/Activities/Skills/Awards) after any future structural edits — currently `h1` → `h2` with no skips, no action needed today
- [ ] Confirm decorative labels (`.mono` tags, `.module-number` digits) stay on non-heading elements (`<p>`/`<div>`) — already correct, no action needed

## Phase 7 — Router / nav UX

- [ ] N/A — no client-side router. Footer scroll-to-top is already implemented.

## Phase 8 — Verification (do last)

- [ ] Serve locally (see `DEVELOPMENT.md`) and inspect `<head>` on both pages for the new tags
- [ ] Test social preview (Slack / iMessage / LinkedIn link unfurl) on both `https://danielfae.com/` and `https://danielfae.com/resume.html`
- [ ] Visit a nonsense URL on the live domain and confirm the branded 404 appears
- [ ] Run a Lighthouse SEO audit on both pages
- [ ] Submit `sitemap.xml` in Search Console; confirm both URLs get discovered

## Status 2026-09-13 (branch `seo/robots-sitemap`, cut from the deployed `claude/main`)

GitHub Pages serves this site from **`claude/main`**, not `main` (local `main` is 22 commits behind). Work on branches cut from `claude/main`.

- Meta, canonical, OG and Twitter tags, and `assets/og-image.jpg` already exist on all three pages.
- Added `robots.txt` and `sitemap.xml`. Replaced `href="index.html"` with `href="/"` in `resume.html` and `projects.html` (GitHub Pages cannot 301 `/index.html`, so stop linking to the duplicate).
- Blog links still point at `daeblog.vercel.app` (11 in `index.html`). Switch them to `https://blog.danielfae.com` only after that domain resolves and serves the blog.
- `projects.html` uses a client-side password panel; the project copy is still present in the HTML source, so crawlers and anyone viewing source can read it. It is not a privacy control.
- Added `404.html` (noindex, root-relative asset URLs so it works at any missing path depth, not in the sitemap).
- "How I Work" card titles changed from `<h4>` to `<h3>`; outline is now h1 → h2 → h3 with no skips.
- Hero performance: `hero-ar.js` is now a small loader. A static poster (`assets/hero-poster.webp`, 2400×1000, plus `hero-poster-1200.webp`), rendered from the scene's own first frame, paints immediately. `hero-scene.js` (the former `hero-ar.js`) and `three` are dynamically imported after `load` + idle, then the canvas fades in over the poster. Under `prefers-reduced-motion: reduce` or `navigator.hardwareConcurrency < 4` three is never fetched and the poster stays as the hero. Local check: LCP is the `IMG.hero-poster` at 390px wide and the `<h1>` name on desktop (Chrome ignores the mostly-transparent full-width poster there); in both cases LCP no longer waits on three.js. To regenerate the poster after changing the scene, re-render its first frame at 2400×1000.
- Remaining: verification (Phase 8): Lighthouse, live 404 check, social unfurls, Search Console.
