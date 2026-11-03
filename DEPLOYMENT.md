# Karl Keel Pottery Website

## Overview
Static portfolio site for Karl Keel's ceramic art. Deployed via **GitHub Pages** from the `main` branch.

- **Domain**: karlkeelpottery.com
- **Repo**: https://github.com/keelp2/kkpottery

## Project Structure
```
kkpottery/
├── index.html              # Home page — bio, featured work, contact form
├── gallery.html            # Gallery (all pieces, lightbox viewer)
├── CNAME                   # Custom domain for GitHub Pages
├── assets/
│   ├── css/styles.css      # Consolidated stylesheet
│   ├── js/main.js          # Lightbox (prev/next, keys, swipe), contact dialog
│   └── images/
│       ├── logo.png        # Site logo / favicon
│       ├── profile.jpg     # Artist photo
│       ├── featured_work/  # Featured pieces on home page (full size)
│       ├── gallery/        # Full gallery collection (full size)
│       └── thumbs/         # ~900px JPEG copies of the above, shown on the pages
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
- Google Fonts (Fraunces + Inter)
- Pages show lightweight thumbnails; the lightbox loads the full-size image

## Adding a gallery photo
1. Put the full-size photo in `assets/images/gallery/` (or `gallery/featured/` for wide shots).
2. Make a thumbnail at the same path under `assets/images/thumbs/gallery/` — roughly 900px on the long side, JPEG quality ~80.
3. Copy one of the `<button class="gallery-item">` blocks in `gallery.html` and point it at the new files.

---

**Last Updated**: November 3, 2026
