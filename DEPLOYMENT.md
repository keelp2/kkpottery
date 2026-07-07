# Karl Keel Pottery Website

## Overview
Static portfolio site for Karl Keel's ceramic art. Deployed via **GitHub Pages** from the `main` branch.

- **Domain**: karlkeelpottery.com
- **Repo**: https://github.com/keelp2/kkpottery

## Project Structure
```
kkpottery/
├── index.html              # Home page — bio, featured work, contact form
├── gallery.html            # Paginated gallery
├── CNAME                   # Custom domain for GitHub Pages
├── assets/
│   ├── css/styles.css      # Consolidated stylesheet
│   ├── js/main.js          # Lightbox, contact form, gallery pagination
│   └── images/
│       ├── logo.png        # Site logo / favicon
│       ├── profile.jpg     # Artist photo
│       ├── featured_work/  # Featured pieces on home page
│       └── gallery/        # Full gallery collection
└── DEPLOYMENT.md           # This file
```

## Deployment
Pushing to `main` triggers automatic deployment via GitHub Pages.

```bash
git add -A
git commit -m "your message"
git push origin main
```

## Technical Details
- Pure HTML/CSS/JavaScript — no build step
- Formspree for contact form (`https://formspree.io/f/mjknawee`)
- Google Fonts (Poppins) loaded via CDN
- Gallery images lazy-loaded

---

**Last Updated**: July 7, 2026
