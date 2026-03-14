# Hero Section Redesign — Design Spec
**Date:** 2026-03-14
**Status:** Approved

## Goal
Transform the current `<header>` hero into a full-viewport (`100svh`) two-column section with dramatic visual weight, clearly separated from the tagline and introductory content below.

## Layout & Structure

### `.container` and `<header>` relationship
- The `<header>` stays inside `.container` (max-width: 1300px, padding: 0 2rem). No full-bleed breakout needed — the max-width constraint is acceptable.
- Remove `padding-bottom: 4rem` and `margin-bottom: 4rem` from the existing `header` CSS rule. Replace with no padding or margin — the `100svh` height and `border-bottom` handle spacing.

### Hero (`<header>`)
- **Height:** `100svh`, `min-height: 600px`
- **Overflow:** `overflow: hidden`
- **Display:** `display: grid; grid-template-columns: 55fr 45fr; align-items: center`
- **Bottom border:** `border-bottom: 1px solid var(--etched-line)` (intentionally upgraded from existing `0.5px`)
- **No top/bottom padding** on the header itself — vertical rhythm is handled by `align-items: center` within the full-height grid

### Left Column
- `display: flex; flex-direction: column; align-self: stretch; padding: 4rem 0`
- `justify-content: space-between` — name+role block at top, `.hero-links` div at bottom
- This gives `.hero-links` a true "anchored to bottom" position within the full column height

### Right Column
- `display: flex; align-items: center; justify-content: center`

### Tagline / Intro
- The `<p class="tagline">` element moves **out of `<header>`** into `<main>`, as the first child before `.philosophy-grid`
- The `<span class="hero-subheader">` wrapper is **kept** (not removed) to preserve the mobile breakpoint rule — but its styles are updated
- Updated `.tagline` CSS: `font-size: 1.4rem`, `max-width: 720px`, `color: var(--ink-faded)`, `padding-top: 4rem`, `margin-bottom: 6rem`
- Updated `.hero-subheader` CSS: `font-size: 1.4rem`, `display: inline`, `font-weight: 300`, `line-height: 1.4`, `color: var(--ink-faded)` — remove `margin-bottom: 0.35rem` (no longer needed inside header)
- Remove `grid-column: 1 / -1` from `.tagline` (no longer inside a grid)

## Typography
- "DANIEL" and "AREVALO" become two `<span style="display:block">` elements inside `<h1 class="hero-title">`
- `.hero-title` CSS: `font-size: clamp(5rem, 10vw, 9rem)`, `font-weight: 800`, `line-height: 0.88`, `letter-spacing: -0.04em`
- Role line (`.mono` below `<h1>`): `margin-top: 1.5rem`, `color: var(--copper-accent)`

## Crosshair SVG (Right Column)

### Markup
Inline `<svg>` element placed directly in the right column div.

### Dimensions & ViewBox
- `viewBox="0 0 600 600"`
- CSS: `width: min(90%, 500px); height: min(90%, 500px); display: block; transform-origin: 50% 50%`

### Elements (all `stroke="currentColor"`, `fill="none"`)
- 5 concentric circles: `cx="300" cy="300"`, r = `280`, `220`, `160`, `100`, `40` — `stroke-width="0.5"`
- Cardinal axis lines: vertical `x1="300" y1="0" x2="300" y2="600"`, horizontal `x1="0" y1="300" x2="600" y2="300"` — `stroke-width="0.3"`
- Diagonal lines: `x1="88" y1="88" x2="512" y2="512"` and `x1="512" y1="88" x2="88" y2="512"` — `stroke-width="0.3"`

### Styling
- `color: var(--ink-deep)` on the SVG (so `currentColor` resolves)
- `opacity: 0.15`
- `animation: slowRotate 120s linear infinite` — reuses the existing `@keyframes slowRotate`
- `transform-origin: 50% 50%` (explicit, to prevent off-axis rotation in all browsers)

## Coordinates Widget

### Desktop (min-width: 1201px)
- `.coordinates` is hidden: add `@media (min-width: 1201px) { .coordinates { display: none; } }`
- Two new links added at the bottom of the hero left column:
  ```html
  <div class="hero-links">
    <a href="resume.html" class="hero-link">Resume →</a>
    <a href="https://daeblog.vercel.app/" class="hero-link">Blog →</a>
  </div>
  ```
- `.hero-links`: `display: flex; gap: 1.5rem`
- `.hero-link`: `font-family: 'Space Mono', monospace; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--hazard-amber); text-decoration: none; border-bottom: 1px solid var(--hazard-amber); padding-bottom: 2px; transition: color 0.2s ease, border-color 0.2s ease`
- `.hero-link:hover`: `color: var(--copper-accent); border-color: var(--copper-accent)`

### Mobile / Tablet (≤ 1200px)
- `.coordinates` resumes its existing fixed icon button behavior (no change)
- `.hero-links`: `display: none`

## Responsive Behavior

### 1025px–1200px range
- `.hero-title` uses `font-size: clamp(5rem, 8vw, 7rem)` — fills the gap between the desktop clamp and the tablet collapse
- Remove the existing `@media (max-width: 1200px)` rule that sets `hero-title { font-size: 6.72rem; white-space: nowrap }` — the new clamp handles this range

### ≤ 1024px — Single Column Collapse
- The two existing `@media (max-width: 1024px)` blocks are **merged into one**:
  ```css
  @media (max-width: 1024px) {
    header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      height: auto;
      min-height: unset;
    }
    .hero-crosshair {
      width: min(50vw, 300px);
      height: min(50vw, 300px);
      margin-bottom: 2rem;
    }
    .hero-title {
      font-size: clamp(3rem, 8vw, 6rem);
      white-space: normal;
      line-height: 0.88;
    }
    .hero-last-name { display: block; }
    .tagline { margin-top: 0; }
  }
  ```
- The crosshair SVG is placed **first in the HTML** (before the left column div) so it naturally stacks above the name in single-column flow — no CSS `order` needed

### ≤ 640px
- `.hero-subheader`: `font-size: 1.1rem` (existing rule kept, targets the retained `<span>`)

## Implementation Notes
- The crosshair wrapper div (placed first in HTML for mobile stacking) must have `grid-column: 2; grid-row: 1` on desktop so it renders in the right column despite being first in source order. The left column div gets `grid-column: 1; grid-row: 1`.
- Verify the `@media (min-width: 1201px) { .coordinates { display: none } }` rule is declared after the coordinates block so it wins the cascade.
- Remove the stale `@media (max-width: 1024px)` block at lines 763–767 (sets `hero-title` to `6.72rem`) — the merged block in the spec replaces it.

## Files to Modify
- `index.html` — header HTML structure, CSS styles, tagline repositioning, coordinates widget visibility, merged media queries

## Out of Scope
- No changes to the philosophy grid, speaking section, tool stack, or footer
- No changes to the coordinates widget's mobile/tablet behavior
- No new fonts or color tokens introduced
