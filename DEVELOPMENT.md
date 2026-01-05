# Development Guide

Technical documentation for running and customizing the portfolio website.

## Running Locally

> **Important**: Opening HTML files directly from Finder/Explorer (`file://` protocol) can cause navigation issues. Always use a local development server.

### Quick Start

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd /path/to/danielfae
   ```
3. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser to `http://localhost:8000`

### Alternative Methods

**VS Code / Cursor Live Server Extension** (Recommended):
1. Install the "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"
3. The site will auto-reload when you make changes

**Using Node.js:**
```bash
npx serve
```

**Using PHP:**
```bash
php -S localhost:8000
```

## File Structure

```
.
├── index.html          # Main portfolio landing page
├── resume.html         # Detailed resume/CV page
├── README.md           # Profile overview
├── DEVELOPMENT.md      # This file - technical docs
├── SITEMAP.md          # Site architecture
├── .gitignore          # Git ignore rules
└── assets/
    ├── Daniel Arevalo CV Resume 2026.pdf
    └── DanitlPhotoContrast.png
```

## Technical Implementation

- **Pure HTML/CSS/JavaScript** - No frameworks required
- **Intersection Observer API** - Scroll reveal animations
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Custom Properties** - Maintainable theming
- **Backdrop Filters** - Glass morphism effects

## Design System

### CSS Variables

```css
:root {
    --vellum-base: #f4f1ea;      /* Background */
    --vellum-highlight: #ffffff;  /* Card backgrounds */
    --ink-deep: #1a1c1e;         /* Primary text */
    --ink-faded: #4a4d52;        /* Secondary text */
    --copper-accent: #b87333;    /* Accent color */
    --hazard-amber: #d4a017;     /* Highlight color */
}
```

### Visual Elements

- Vellum-inspired texture overlay
- NieR:Automata-style geometric backgrounds
- Topographic line patterns (SVG)
- Grain texture for tactile feel

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- No external dependencies except Google Fonts
- Inline SVG for graphics
- CSS transform animations (GPU accelerated)
- Lazy loading with Intersection Observer

