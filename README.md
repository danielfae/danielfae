# Daniel's Portfolio Website

A professional portfolio website for a Lead Product Experience Designer specializing in high-stakes cybersecurity and operational technology (OT) systems.

## Overview

This portfolio showcases expertise in designing critical infrastructure security solutions at the intersection of OT, IT, and physical security. The site emphasizes a core philosophy of "Amplification over Automation" - using AI to enhance human expertise rather than replace it.

## Features

- **Vellum-Inspired Design**: Sophisticated aesthetic with grain texture overlay and topographic background
- **Interactive Animations**:
  - Scroll reveal animations for sections
  - Mouse-tracking parallax effects
  - Smooth hover transitions on cards and elements
- **Responsive Layout**: Fully mobile-responsive design that adapts to all screen sizes
- **Key Sections**:
  - Core Philosophy & Manifesto
  - Educational Framework for designers transitioning to cybersecurity
  - Speaking & Advocacy engagements
  - Technical Stack showcase

## Design Highlights

### Visual Elements
- Custom CSS variables for easy theming
- Google Fonts integration (Outfit & Space Mono)
- Topographic line patterns with SVG backgrounds
- Grain texture overlay for tactile feel
- Copper and amber accent colors for emphasis

### Technical Implementation
- Pure HTML/CSS/JavaScript (no frameworks required)
- Intersection Observer API for scroll animations
- CSS Grid and Flexbox for responsive layouts
- CSS custom properties for maintainable theming
- Backdrop filters for glass morphism effects

## Running Locally

### Quick Start

1. Clone the repository
2. Navigate to the project directory
3. Start a local web server:

```bash
python3 -m http.server 8000
```

4. Open your browser to `http://localhost:8000`

### Alternative Methods

Using Node.js:
```bash
npx serve
```

Using PHP:
```bash
php -S localhost:8000
```

## File Structure

```
.
├── index.html          # Main portfolio page (single-file application)
└── README.md          # Project documentation
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

The website uses CSS custom properties for easy customization:

```css
:root {
    --vellum-base: #f4f1ea;      /* Background color */
    --ink-deep: #1a1c1e;         /* Primary text */
    --hazard-amber: #d4a017;     /* Accent color */
    /* ... more variables */
}
```

## Performance

- No external dependencies except Google Fonts
- Inline SVG for graphics
- Optimized animations with CSS transforms
- Lazy loading with Intersection Observer

## License

© 2024 Daniel - All rights reserved

## Contact

For inquiries about design services or speaking engagements, visit the portfolio website.
