# Daniel Arevalo - Site Architecture

## Site Map

```
danielfae/
│
├── index.html          # Homepage - Main landing page
│   └── resume.html     # Resume/CV subpage
│
└── assets/
    ├── Daniel Arevalo CV Resume 2026.pdf   # Downloadable PDF resume
    └── DanitlPhotoContrast.png             # Profile photo
```

## Page Structure

### 🏠 Homepage (`index.html`)
**Primary landing page showcasing Daniel's professional identity**

- **Header**
  - Title & role
  - Tagline
  - Location coordinates
  - Navigation link to Resume

- **Main Content**
  - Philosophy/Manifesto section ("Amplification over Automation")
  - Sidebar data cards (Background, Focus, Partnerships)
  - Educational Framework modules (OT vs IT, Operational Language, Zero-Error UX)
  - Speaking & Advocacy engagements
  - Technical Stack & tools

- **Footer**
  - Copyright
  - Brand tagline

### 📄 Resume (`resume.html`)
**Detailed professional resume/CV page**

- **Header**
  - Profile photo
  - Name & professional tagline
  - Contact information (Location, Email, Phone)

- **Content Sections**
  - Work Experience (2012-2026)
  - Education
  - Other Activities
  - Awards
  - Skills
  - Languages
  - Interests

## Navigation Flow

```
┌─────────────┐
│   index.html │
│  (Homepage)  │
└──────┬──────┘
       │
       │ "VIEW RESUME →"
       ▼
┌─────────────┐
│ resume.html  │
│   (Resume)   │
└─────────────┘
```

## Assets

| File | Type | Used In |
|------|------|---------|
| `DanitlPhotoContrast.png` | Image | `resume.html` (profile photo) |
| `Daniel Arevalo CV Resume 2026.pdf` | PDF | Available for download |

## Design System

### Colors (from index.html)
- `--vellum-base`: #f4f1ea (Background)
- `--vellum-highlight`: #ffffff (Card backgrounds)
- `--ink-deep`: #1a1c1e (Primary text)
- `--ink-faded`: #4a4d52 (Secondary text)
- `--copper-accent`: #b87333 (Accent)
- `--hazard-amber`: #d4a017 (Highlight/CTA)

### Typography
- **Headings**: Outfit (300, 600, 800 weights)
- **Monospace**: Space Mono (labels, coordinates)

## Future Expansion

Potential pages to add:
- `/projects.html` - Portfolio/case studies
- `/contact.html` - Contact form
- `/blog/` - Articles and insights

