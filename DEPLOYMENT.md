# KK Pottery Website - Deployment Guide

## Overview
This guide covers the deployment process for the KK Pottery website to Porkbun hosting.

## Pre-Deployment Checklist

### ✅ Completed Optimizations
- [x] **Image Optimization**: All large images compressed (67-86% size reduction)
- [x] **CSS Cleanup**: Extracted duplicate styles to external stylesheet
- [x] **JavaScript Optimization**: Modularized code into external JS file
- [x] **SEO Improvements**: Added comprehensive meta tags and Open Graph data
- [x] **Code Organization**: Clean file structure with proper asset organization

### 📁 Project Structure
```
kkpottery/
├── index.html              # Main page with optimized SEO
├── gallery.html            # Gallery page with pagination
├── assets/
│   ├── css/
│   │   └── styles.css      # Consolidated stylesheet
│   ├── js/
│   │   └── main.js         # Modular JavaScript
│   └── images/
│       ├── logo.jpg        # 68KB (optimized)
│       ├── profile.jpg     # 330KB (optimized, was 1.1MB)
│       ├── insta.png       # 80KB (optimized, was 600KB)
│       ├── featured_work/  # Optimized featured pieces
│       └── gallery/        # Complete gallery collection
├── optimize-images.ps1     # Image optimization script
└── DEPLOYMENT.md           # This file
```

## Performance Improvements

### Image Optimization Results
- **IMG_3489.jpg**: 1.62MB → 0.34MB (78.8% reduction)
- **IMG_9736.PNG**: 1.36MB → 0.34MB (75% reduction) 
- **IMG_9735.PNG**: 1.34MB → 0.28MB (78.8% reduction)
- **IMG_1869.jpg**: 1.18MB → 0.38MB (67.7% reduction)
- **profile.jpg**: 1.05MB → 0.33MB (68.7% reduction)
- **insta.png**: 0.59MB → 0.08MB (86.3% reduction)

### Code Organization
- **CSS**: Removed ~150 lines of duplicate inline styles
- **JavaScript**: Converted 200+ lines of inline script to modular classes
- **HTML**: Cleaner markup with semantic structure

## SEO Enhancements

### Meta Tags Added
- Comprehensive descriptions for both pages
- Targeted keywords for pottery/ceramics niche
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs
- Proper author attribution

## Deployment Instructions

### 1. Backup Current Site
```bash
# Download current site files from Porkbun
# Keep as backup in case rollback needed
```

### 2. Upload Files
Upload the entire project directory to your Porkbun hosting:
- Use FTP client or Porkbun file manager
- Ensure all files maintain their directory structure
- Upload `assets/` folder with all subdirectories

### 3. Verify File Permissions
- HTML files: 644
- CSS/JS files: 644  
- Image files: 644
- Directories: 755

### 4. Test Functionality
After deployment, test:
- [ ] Homepage loads correctly
- [ ] Gallery page displays all images
- [ ] Lightbox functionality works
- [ ] Contact form submits properly
- [ ] Navigation links work
- [ ] Mobile responsiveness
- [ ] Social media links

### 5. SEO Validation
- [ ] Check Google Search Console for any issues
- [ ] Test meta tags with Facebook/Twitter validators
- [ ] Verify canonical URLs work
- [ ] Check robots.txt accessibility

## Technical Details

### Dependencies
- No external dependencies required
- Pure HTML/CSS/JavaScript
- Formspree integration for contact form
- Google Fonts (Poppins) loaded via CDN

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari 12+, Chrome Mobile)

### Performance Metrics
- **Page Load**: < 2 seconds on good connection
- **Image Loading**: Lazy loading implemented
- **CSS**: Minified and optimized
- **JavaScript**: Async loading, modular structure

## Post-Deployment

### Monitoring
- Monitor site performance with Google Analytics
- Check form submissions are working
- Verify image loading speeds
- Test on mobile devices

### Maintenance
- Regular image optimization for new additions
- Keep SEO meta tags updated
- Monitor Formspree usage limits
- Backup site regularly

## Troubleshooting

### Common Issues
1. **Images not loading**: Check file paths and permissions
2. **Contact form not working**: Verify Formspree endpoint
3. **CSS not applying**: Check stylesheet path
4. **JavaScript errors**: Check browser console

### Rollback Plan
If issues arise:
1. Restore backup files immediately
2. Identify problematic changes
3. Fix issues before redeploying
4. Test thoroughly before going live again

## Contact
For deployment issues or questions:
- Email: karlkeel1@comcast.net
- Portfolio: https://kkpottery.com

---

**Last Updated**: March 13, 2026
**Version**: 2.0 (Optimized)
