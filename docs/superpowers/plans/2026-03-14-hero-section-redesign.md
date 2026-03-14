# Hero Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the `<header>` in `index.html` into a full-viewport two-column hero with a rotating Nier-style crosshair SVG on the right and the name/role anchored to the left, clearly separated from intro content below.

**Architecture:** All changes are in a single file (`index.html`) — CSS lives in `<style>`, HTML in `<body>`. The plan works top-to-bottom through the file: CSS first (so structure is defined before markup), then HTML restructuring. No new files. No JavaScript changes.

**Tech Stack:** Plain HTML, CSS (custom properties, CSS grid, flexbox, SVG animation), no build step.

**Spec:** `docs/superpowers/specs/2026-03-14-hero-section-redesign.md`

---

## Chunk 1: CSS — Hero Layout, Crosshair, Hero Links, Coordinates

### Task 1: Update `header` CSS rule

**Files:**
- Modify: `index.html` — the `header { ... }` block (lines 176–183)

- [ ] **Step 1: Locate the existing `header` CSS block**

It currently reads:
```css
header {
    border-bottom: 0.5px solid var(--etched-line);
    padding-bottom: 4rem;
    margin-bottom: 4rem;
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: end;
}
```

- [ ] **Step 2: Replace with the new hero layout rule**

```css
header {
    height: 100svh;
    min-height: 600px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 55fr 45fr;
    align-items: center;
    border-bottom: 1px solid var(--etched-line);
}
```

- [ ] **Step 3: Verify in browser**

Open `index.html` in a browser. The header should now occupy the full viewport height with a visible bottom border. Content below should be out of view on load.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: set header to full-viewport two-column grid"
```

---

### Task 2: Add `.hero-left` and `.hero-right` column CSS

**Files:**
- Modify: `index.html` — add new CSS rules after the `header` block

- [ ] **Step 1: Add left and right column rules immediately after the `header` block**

```css
.hero-left {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    justify-content: space-between;
    padding: 4rem 0;
    grid-column: 1;
    grid-row: 1;
}

.hero-right {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 2;
    grid-row: 1;
}
```

Note: Even though `.hero-right` appears first in the HTML (for mobile stacking), `grid-column: 2` places it in the right column on desktop. `.hero-left` gets `grid-column: 1` to anchor it left regardless of DOM order.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add hero-left and hero-right column CSS"
```

---

### Task 3: Update `.hero-title` CSS and `.container` top padding

**Files:**
- Modify: `index.html` — the `.hero-title { ... }` block (lines 185–192) and `.container` rule (line 160)

- [ ] **Step 1: Locate the existing `.container` block**

It currently reads:
```css
.container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 4rem 2rem;
    position: relative;
}
```

- [ ] **Step 2: Remove top padding from `.container` so the hero's vertical centering isn't thrown off**

The `4rem` top padding would push content down inside the `100svh` hero, making the name appear below true center. Change only `padding` to remove the top/bottom values — side padding stays:

```css
.container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
}
```

- [ ] **Step 3: Add bottom padding back to `<main>` so non-hero content still has breathing room**

After the `.container` rule, add:

```css
main {
    padding-top: 0;
    padding-bottom: 4rem;
}
```

- [ ] **Step 4: Locate the existing `.hero-title` block**

It currently reads:
```css
.hero-title {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.04em;
    margin-top: 0;
    margin-bottom: 0.35rem;
}
```

- [ ] **Step 5: Replace with new values**

```css
.hero-title {
    font-size: clamp(5rem, 10vw, 9rem);
    font-weight: 800;
    line-height: 0.88;
    letter-spacing: -0.04em;
    margin-top: 0;
    margin-bottom: 0;
}
```

- [ ] **Step 6: Add a targeted rule for the role line spacing**

Add immediately after `.hero-title`:

```css
.hero-left .mono {
    margin-top: 1.5rem;
    color: var(--copper-accent);
}
```

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: update hero-title typography and fix container padding for 100svh hero"
```

---

### Task 4: Add crosshair SVG CSS

**Files:**
- Modify: `index.html` — add new CSS rule for `.hero-crosshair`

- [ ] **Step 1: Add the crosshair SVG styling rule after the `.hero-right` rule**

```css
.hero-crosshair {
    width: min(90%, 500px);
    height: min(90%, 500px);
    display: block;
    color: var(--ink-deep);
    opacity: 0.15;
    transform-origin: 50% 50%;
    animation: slowRotate 120s linear infinite;
}
```

Note: `slowRotate` is already defined in the stylesheet — no new keyframe needed.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add hero-crosshair SVG animation CSS"
```

---

### Task 5: Add `.hero-links` CSS

**Files:**
- Modify: `index.html` — add new CSS rules for hero links

- [ ] **Step 1: Add hero-links styles after `.hero-crosshair`**

```css
.hero-links {
    display: flex;
    gap: 1.5rem;
}

.hero-link {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--hazard-amber);
    text-decoration: none;
    border-bottom: 1px solid var(--hazard-amber);
    padding-bottom: 2px;
    transition: color 0.2s ease, border-color 0.2s ease;
}

.hero-link:hover {
    color: var(--copper-accent);
    border-color: var(--copper-accent);
}
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add hero-links CSS for desktop resume/blog links"
```

---

### Task 6: Update `.tagline` and `.hero-subheader` CSS

**Files:**
- Modify: `index.html` — update existing `.tagline` and `.hero-subheader` rules

- [ ] **Step 1: Locate `.tagline` rule**

Currently:
```css
.tagline {
    font-size: 1.25rem;
    max-width: 900px;
    color: var(--ink-faded);
    margin-top: 0.25rem;
    grid-column: 1 / -1;
}
```

- [ ] **Step 2: Replace `.tagline`**

```css
.tagline {
    font-size: 1.4rem;
    max-width: 720px;
    color: var(--ink-faded);
    padding-top: 4rem;
    margin-bottom: 6rem;
}
```

- [ ] **Step 3: Locate `.hero-subheader` rule**

Currently:
```css
.hero-subheader {
    display: block;
    font-size: 1.7rem;
    font-weight: 300;
    line-height: 1.18;
    letter-spacing: 0;
    color: var(--ink-deep);
    margin-bottom: 0.35rem;
}
```

- [ ] **Step 4: Replace `.hero-subheader`**

```css
.hero-subheader {
    display: inline;
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 1.4;
    color: var(--ink-faded);
}
```

- [ ] **Step 5: Locate the `@media (max-width: 640px)` block for `.hero-subheader`**

Currently (around line 769):
```css
@media (max-width: 640px) {
    .hero-subheader {
        font-size: 1.25rem;
        line-height: 1.3;
        opacity: 0.92;
    }
}
```

- [ ] **Step 6: Replace it**

Remove `opacity: 0.92` (conflicts with the new `color: var(--ink-faded)` which already handles visual lightness). Update font-size to spec value:

```css
@media (max-width: 640px) {
    .hero-subheader {
        font-size: 1.1rem;
        line-height: 1.3;
    }
}
```

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: update tagline, hero-subheader CSS and fix mobile opacity conflict"
```

---

### Task 7: Fix responsive media queries

**Files:**
- Modify: `index.html` — update and merge existing media query blocks

- [ ] **Step 1: Remove the `@media (max-width: 1200px)` hero-title rule**

Find and delete this entire block (around line 727):
```css
@media (max-width: 1200px) {
    .hero-title {
        width: 100%;
        max-width: 100vw;
        white-space: nowrap;
        font-size: 6.72rem;
    }
}
```

- [ ] **Step 2: Insert three replacement rules at the same location**

The `@media (min-width: 1201px)` rule MUST appear after the existing `@media (max-width: 1200px)` coordinates block (which ends around line 708) to win the cascade. Place all three rules together after where the old 1200px hero-title block was:

```css
@media (max-width: 1200px) {
    .hero-links {
        display: none;
    }
}

/* Must be declared after the max-width: 1200px coordinates block above */
@media (min-width: 1201px) {
    .coordinates {
        display: none;
    }
}
```

- [ ] **Step 3: Find and delete the duplicate 1024px block**

Find this block (around line 763) and delete it entirely:
```css
@media (max-width: 1024px) {
    .hero-title {
        font-size: 6.72rem;
    }
}
```

- [ ] **Step 4: Find and replace the main `@media (max-width: 1024px)` block**

Locate the existing block (around line 736) that starts `@media (max-width: 1024px) { header { grid-template-columns: 1fr; ... }` and replace it entirely with:

```css
@media (max-width: 1024px) {
    header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: auto;
        min-height: unset;
        overflow: visible;
    }

    .hero-crosshair {
        width: min(50vw, 300px);
        height: min(50vw, 300px);
        margin-bottom: 2rem;
    }

    .hero-left {
        padding: 2rem 0;
    }

    .hero-title {
        font-size: clamp(3rem, 8vw, 6rem);
        white-space: normal;
        line-height: 0.88;
    }

    .hero-last-name {
        display: block;
    }

    .tagline {
        margin-top: 0;
    }
}
```

- [ ] **Step 5: Verify all three breakpoints in browser**

- Desktop (> 1200px): two-column hero, coordinates hidden, hero-links visible
- Tablet (1025–1200px): two-column hero still active, coordinates icons visible top-right, hero-links hidden
- Mobile (≤ 1024px): single-column, crosshair above name, header height is auto

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: fix and merge responsive media queries for hero redesign"
```

---

## Chunk 2: HTML — Restructure Header and Move Tagline

### Task 8: Restructure `<header>` HTML

**Files:**
- Modify: `index.html` — the `<header>` block in `<body>` (lines 788–828)

- [ ] **Step 1: Locate the current `<header>` block**

It currently contains:
```html
<header>
    <div>
        <h1 class="hero-title">DANIEL <span class="hero-last-name">AREVALO</span></h1>
        <p class="mono">Lead Product Experience Designer @ <a href="...">OmnySecurity.com</a></p>
    </div>
    <div class="coordinates">...</div>
    <p class="tagline"><span class="hero-subheader">...</span></p>
</header>
```

- [ ] **Step 2: Replace the `<header>` with the new structure**

The crosshair div goes FIRST in source order (for mobile stacking above the name), the left column SECOND. CSS `grid-column` rules from Task 2 ensure they render in the correct visual columns on desktop regardless of DOM order.

```html
<header>
    <!-- Right column: crosshair (first in DOM for mobile stacking) -->
    <div class="hero-right">
        <svg class="hero-crosshair" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="300" cy="300" r="280" stroke="currentColor" stroke-width="0.5"/>
            <circle cx="300" cy="300" r="220" stroke="currentColor" stroke-width="0.5"/>
            <circle cx="300" cy="300" r="160" stroke="currentColor" stroke-width="0.5"/>
            <circle cx="300" cy="300" r="100" stroke="currentColor" stroke-width="0.5"/>
            <circle cx="300" cy="300" r="40"  stroke="currentColor" stroke-width="0.5"/>
            <line x1="300" y1="0"   x2="300" y2="600" stroke="currentColor" stroke-width="0.3"/>
            <line x1="0"   y1="300" x2="600" y2="300" stroke="currentColor" stroke-width="0.3"/>
            <line x1="88"  y1="88"  x2="512" y2="512" stroke="currentColor" stroke-width="0.3"/>
            <line x1="512" y1="88"  x2="88"  y2="512" stroke="currentColor" stroke-width="0.3"/>
        </svg>
    </div>

    <!-- Left column: name, role, hero links -->
    <div class="hero-left">
        <div>
            <h1 class="hero-title">
                <span style="display:block">DANIEL</span>
                <span style="display:block" class="hero-last-name">AREVALO</span>
            </h1>
            <p class="mono">Lead Product Experience Designer @ <a href="https://omnysecurity.com" target="_blank">OmnySecurity.com</a></p>
        </div>
        <div class="hero-links">
            <a href="resume.html" class="hero-link">Resume →</a>
            <a href="https://daeblog.vercel.app/" class="hero-link">Blog →</a>
        </div>
    </div>

    <!-- Coordinates widget (mobile/tablet only, hidden on desktop via CSS) -->
    <div class="coordinates">
        <a href="resume.html" class="resume-icon" aria-label="View Resume">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
        </a>
        <a href="https://daeblog.vercel.app/" class="blog-icon" aria-label="Read Blog">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
            </svg>
        </a>
        <div class="location-icon" tabindex="0" aria-label="Location info">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        </div>
        <div class="coord-content">
            LOCATION: OSLO, NORWAY<br>
            [59.9139° N, 10.7522° E]<br>
            ORIGIN: CUCUTA, COLOMBIA<br>
            <div class="coord-links">
                <a href="resume.html" class="coord-link">VIEW RESUME →</a>
                <a href="https://daeblog.vercel.app/" class="coord-link coord-link--blog">READ BLOG →</a>
            </div>
        </div>
    </div>
</header>
```

- [ ] **Step 3: Verify in browser at desktop width**

- Two-column layout visible: name+role on left, crosshair rotating on right
- Resume → and Blog → links appear at bottom-left of the hero
- Coordinates icons NOT visible on desktop

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: restructure header HTML for two-column hero with crosshair SVG"
```

---

### Task 9: Move tagline into `<main>`

**Files:**
- Modify: `index.html` — add tagline to top of `<main>`

- [ ] **Step 1: Confirm no `<p class="tagline">` remains inside `<header>`**

The tagline was already excluded from the new header HTML in Task 8. Confirm there is no `<p class="tagline">` between `<header>` and `</header>`.

- [ ] **Step 2: Add the tagline as the first child of `<main>`**

Locate `<main>` (currently opens directly with `<section class="philosophy-grid">`). Insert before that section:

```html
<p class="tagline"><span class="hero-subheader">I design and build AI-powered cybersecurity products to protect society's most critical infrastructure. With a human-centered approach, I ensure that IT/OT environments become safer while making people more efficient in complex industrial operations.</span></p>
```

- [ ] **Step 3: Verify in browser**

- Scroll past the hero — the tagline paragraph appears as the first content in `<main>` above the philosophy grid
- Text reads at ~1.4rem, max-width ~720px, faded ink color
- 4rem gap above (padding-top), 6rem gap below (margin-bottom) before the philosophy grid

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: move tagline into main as intro statement below hero"
```

---

### Task 10: Final visual verification

**Files:** None — verification only

- [ ] **Step 1: Open `index.html` at full desktop width (>1200px)**

- [ ] Hero fills viewport height (100svh)
- [ ] "DANIEL" stacked above "AREVALO" in large display type, left column, vertically centered
- [ ] Role line in Space Mono copper color, 1.5rem gap below name
- [ ] Resume → and Blog → links at bottom-left in amber mono style
- [ ] Crosshair SVG in right column, slowly rotating
- [ ] Coordinates widget NOT visible
- [ ] Solid bottom border separating hero from tagline below

- [ ] **Step 2: Check tablet (1025–1200px)**

- [ ] Two-column grid still active
- [ ] Coordinates icon buttons visible (top-right, fixed)
- [ ] Hero-links NOT visible
- [ ] Crosshair rotating at correct size

- [ ] **Step 3: Check mobile (≤ 1024px)**

- [ ] Single column: crosshair above name
- [ ] Header height is auto (not 100svh)
- [ ] Tagline readable below the hero at reduced font-size

- [ ] **Step 4: Final commit**

```bash
git add index.html
git commit -m "feat: hero section redesign complete — full-viewport two-column with crosshair"
```
