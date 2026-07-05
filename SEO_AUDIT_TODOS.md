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

- [ ] `index.html`: add `<meta name="description">`
- [ ] `index.html`: add `<link rel="canonical" href="https://danielfae.com/">`
- [ ] `index.html`: add Open Graph tags (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`)
- [ ] `index.html`: add Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] `resume.html`: add `<meta name="description">`
- [ ] `resume.html`: add `<link rel="canonical" href="https://danielfae.com/resume.html">`
- [ ] `resume.html`: add Open Graph tags
- [ ] `resume.html`: add Twitter Card tags
- [ ] Create a dedicated 1200×630 OG share image (e.g. `assets/og-image.png`) and reference it via an absolute URL in both pages' `og:image` / `twitter:image` — don't reuse the profile photo as-is
- [ ] Skip Phase 2 (SPA meta hook) — not applicable, this isn't a client-side-routed SPA

## Phase 3 — robots.txt

- [ ] Add `/robots.txt` at the repo root: `User-agent: *`, `Allow: /`, `Sitemap: https://danielfae.com/sitemap.xml`

## Phase 4 — sitemap.xml

- [ ] Add `/sitemap.xml` at the repo root listing `/` (priority `1.0`) and `/resume.html` (priority `0.7`)
- [ ] Reference the sitemap from `robots.txt` (done together with Phase 3 item above)
- [ ] After deploy, submit the sitemap to Google Search Console and Bing Webmaster Tools

## Phase 5 — 404 page

- [ ] Add `/404.html` at the repo root (GitHub Pages serves this automatically for unknown paths under a custom domain)
- [ ] Single `<h1>` explaining the error, a paragraph, and a link back to `index.html`
- [ ] Give it its own `<title>` / description
- [ ] Do not list it in `sitemap.xml`

## Phase 6 — Heading hierarchy

- [ ] Fix the skip in `index.html`: change the four module-card `<h4>` titles under the "Design Process" `<h2>` to `<h3>` (~lines 1613-1631 in the `module-grid`/`module-card` blocks)
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
