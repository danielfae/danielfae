# Hero Section Redesign — Design Spec
**Date:** 2026-03-14
**Status:** Approved

## Goal
Transform the current `<header>` hero into a full-viewport (100svh) two-column section with dramatic visual weight, clearly separated from the tagline and introductory content below.

## Layout & Structure

### Hero (`<header>`)
- **Height:** `100svh` (full viewport height)
- **Grid:** Two-column CSS grid — left 55%, right 45%
- **Left column:** Name stacked ("DANIEL" / "AREVALO"), role line in Space Mono below, Resume + Blog links anchored to bottom-left on desktop
- **Right column:** Inline SVG crosshair (concentric circles + cardinal axes + diagonal lines), slowly rotating, fills ~90% of column width
- **Bottom border:** `1px solid var(--etched-line)` separating hero from content below

### Tagline / Intro
- The existing tagline paragraph moves **out of `<header>`** into `<main>` as the opening intro statement
- Style: `font-size: 1.4rem`, `max-width: 720px`, `color: var(--ink-faded)`, `margin-bottom: 6rem`
- Sits above the existing philosophy grid

## Typography
- "DANIEL" and "AREVALO" on separate lines
- `font-size: clamp(5rem, 10vw, 9rem)`, `font-weight: 800`, `line-height: 0.88`, `letter-spacing: -0.04em`
- Role line: Space Mono, `var(--copper-accent)`, existing mono styles

## Crosshair SVG (Right Column)
- Inline SVG, not a background image
- Elements: 5 concentric circles + cardinal axis lines (N/S/E/W) + diagonal lines
- Color: `var(--ink-deep)` at ~15% opacity strokes
- Animation: `rotate 120s linear infinite` (matches existing background circle speed)
- Size: `min(90%, 500px)` within the column

## Separation from Content Below
- `<header>` ends with `border-bottom: 1px solid var(--etched-line)`
- Generous padding below the border (`padding-bottom: 4rem`)
- Tagline in `<main>` has `padding-top: 4rem` for breathing room

## Responsive Behavior
- **≤ 1024px:** Single-column layout; crosshair moves above the name, reduced to `50vw` max-size; name returns to current responsive stacking behavior
- **≤ 1200px:** Coordinates widget collapses to fixed icon buttons (no change from current behavior)
- **Mobile:** Resume/Blog links in hero bottom-left are hidden (already surfaced in coordinates widget)

## Files to Modify
- `index.html` — header HTML structure, CSS styles, and tagline repositioning

## Out of Scope
- No changes to the philosophy grid, speaking section, tool stack, or footer
- No changes to the coordinates widget behavior
- No new fonts or color tokens introduced
