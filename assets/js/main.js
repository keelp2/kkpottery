// Main JavaScript file for KK Pottery website

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Lightbox functionality
class Lightbox {
  constructor() {
    this.lightbox = $('#lightbox');
    this.lightboxImg = $('#lightboxImage');
    this.init();
  }

  init() {
    if (!this.lightbox) return;

    // Close lightbox when clicking outside the image
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });

    // Add click handlers to all images with lightbox capability
    this.addImageHandlers();
  }

  addImageHandlers() {
    // Featured work images
    $$('.pottery-item img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.open(img.src);
      });
    });

    // Gallery images
    $$('.gallery-item img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.open(img.src);
      });
    });
  }

  open(src) {
    if (this.lightboxImg) {
      this.lightboxImg.src = src;
      this.lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Contact form functionality
class ContactForm {
  constructor() {
    this.modal = $('#contactModal');
    this.button = $('#contactButton');
    this.closeBtn = $('.close');
    this.form = $('#contactForm');
    this.formMessage = $('#formMessage');
    this.init();
  }

  init() {
    if (!this.modal || !this.button) return;

    // Open modal
    this.button.addEventListener('click', () => this.open());

    // Close modal events
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  open() {
    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.resetForm();
    this.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  resetForm() {
    if (this.formMessage) {
      this.formMessage.textContent = '';
      this.formMessage.className = 'form-message';
    }
    if (this.form) {
      this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      this.form.querySelectorAll('.error-message').forEach(el => el.remove());
    }
  }

  validateForm() {
    if (!this.form) return false;

    let isValid = true;
    const name = this.form.querySelector('#name');
    const email = this.form.querySelector('#email');
    const message = this.form.querySelector('#message');

    // Reset previous errors
    [name, email, message].forEach(field => {
      if (field) {
        field.classList.remove('error');
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      }
    });

    // Validate name
    if (name && name.value.trim().length < 2) {
      this.showError(name, 'Please enter your name (at least 2 characters)');
      isValid = false;
    }

    // Validate email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        this.showError(email, 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Validate message
    if (message && message.value.trim().length < 10) {
      this.showError(message, 'Please enter a message (at least 10 characters)');
      isValid = false;
    }

    return isValid;
  }

  showError(field, message) {
    if (!field) return;
    
    field.classList.add('error');
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    field.parentNode.insertBefore(errorMsg, field.nextSibling);
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) return;
    
    const formData = new FormData(this.form);
    const submitButton = this.form.querySelector('button[type="submit"]');
    
    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      
      // Submit to Formspree
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        this.showSuccess();
      } else {
        throw new Error('Form submission failed');
      }
      
    } catch (error) {
      console.error('Error:', error);
      this.showError();
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  }

  showSuccess() {
    if (this.formMessage) {
      this.formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      this.formMessage.className = 'form-message success';
    }
    if (this.form) {
      this.form.reset();
    }
    
    // Hide the message after 5 seconds
    setTimeout(() => {
      if (this.formMessage) {
        this.formMessage.textContent = '';
        this.formMessage.className = 'form-message';
      }
      this.close();
    }, 5000);
  }

  showError() {
    if (this.formMessage) {
      this.formMessage.textContent = 'Error sending message. Please try again or email me directly at karlkeel1@comcast.net';
      this.formMessage.className = 'form-message error';
    }
  }
}

// Gallery pagination functionality
class GalleryPagination {
  constructor() {
    this.galleryGrid = $('#galleryGrid');
    this.prevButton = $('#prevPage');
    this.nextButton = $('#nextPage');
    this.pageNumbers = $('#pageNumbers');
    this.itemsPerPage = 14;
    this.currentPage = 1;
    this.allImages = [];
    this.init();
  }

  init() {
    if (!this.galleryGrid) return;

    this.loadImages();
    this.setupEventListeners();
    this.renderGallery();
  }

  loadImages() {
    // Gallery images configuration
    this.allImages = [
      { src: "featured/IMG_2784.jpg", type: 'featured' },
      { src: "IMG_4508.jpg", type: 'regular' },
      { src: "IMG_4717.jpg", type: 'regular' },
      { src: "IMG_4743.jpg", type: 'regular' },
      { src: "IMG_4775.jpg", type: 'regular' },
      { src: "IMG_4596.jpg", type: 'regular' },
      { src: "IMG_4720.jpg", type: 'regular' },
      { src: "IMG_4680.jpg", type: 'regular' },
      { src: "IMG_4801.jpg", type: 'regular' },
      { src: "featured/IMG_0156.jpg", type: 'featured' },
      { src: "IMG_4684.jpg", type: 'regular' },
      { src: "IMG_4752.jpg", type: 'regular' },
      { src: "IMG_4581.jpg", type: 'regular' },
      { src: "IMG_4784.jpg", type: 'regular' },
      { src: "featured/IMG_8488.jpg", type: 'featured' },
      { src: "IMG_4629.jpg", type: 'regular' },
      { src: "IMG_4686.jpg", type: 'regular' },
      { src: "IMG_4727.jpg", type: 'regular' },
      { src: "IMG_4761.jpg", type: 'regular' },
      { src: "IMG_4785.jpg", type: 'regular' },
      { src: "IMG_4641.jpg", type: 'regular' },
      { src: "IMG_4688.jpg", type: 'regular' },
      { src: "IMG_4729.jpg", type: 'regular' },
      { src: "featured/IMG_9565.jpg", type: 'featured' },
      { src: "IMG_4767.jpg", type: 'regular' },
      { src: "IMG_4786.jpg", type: 'regular' },
      { src: "IMG_4797.jpg", type: 'regular' },
      { src: "IMG_4663.jpg", type: 'regular' },
      { src: "IMG_4701.jpg", type: 'regular' },
      { src: "IMG_4737.jpg", type: 'regular' },
      { src: "IMG_4769.jpg", type: 'regular' },
      { src: "IMG_4796.jpg", type: 'regular' },
      { src: "featured/IMG_0181.jpg", type: 'featured' }
    ];

    // Ensure first image is featured
    if (this.allImages[0].type !== 'featured') {
      const featuredIndex = this.allImages.findIndex(img => img.type === 'featured');
      if (featuredIndex > -1) {
        const [featured] = this.allImages.splice(featuredIndex, 1);
        this.allImages.unshift(featured);
      }
    }
  }

  setupEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.previousPage());
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.nextPage());
    }
  }

  renderGallery() {
    if (!this.galleryGrid) return;

    this.galleryGrid.innerHTML = '';
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allImages.length);
    const pageItems = this.allImages.slice(startIndex, endIndex);
    
    pageItems.forEach(image => {
      const item = document.createElement('div');
      item.className = `gallery-item ${image.type}`;
      
      const img = document.createElement('img');
      img.src = `assets/images/gallery/${image.src}?v=3`;
      img.alt = 'Pottery artwork';
      img.loading = 'lazy';
      
      // Add click event for lightbox
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.lightbox) {
          window.lightbox.open(img.src);
        }
      });
      
      item.appendChild(img);
      this.galleryGrid.appendChild(item);
    });

    this.updatePagination();
  }

  updatePagination() {
    const totalPages = Math.ceil(this.allImages.length / this.itemsPerPage);
    
    // Update prev/next buttons
    if (this.prevButton) {
      this.prevButton.disabled = this.currentPage === 1;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentPage === totalPages;
    }
    
    // Update page numbers
    if (this.pageNumbers) {
      this.pageNumbers.innerHTML = '';
      const maxVisiblePages = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Add first page and ellipsis if needed
      if (startPage > 1) {
        this.addPageNumber(1);
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.textContent = '...';
          this.pageNumbers.appendChild(ellipsis);
        }
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        this.addPageNumber(i);
      }
      
      // Add last page and ellipsis if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.textContent = '...';
          this.pageNumbers.appendChild(ellipsis);
        }
        this.addPageNumber(totalPages);
      }
    }
  }

  addPageNumber(page) {
    const pageBtn = document.createElement('span');
    pageBtn.textContent = page;
    pageBtn.className = 'page-number' + (page === this.currentPage ? ' active' : '');
    pageBtn.addEventListener('click', () => {
      if (page !== this.currentPage) {
        this.currentPage = page;
        this.renderGallery();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    this.pageNumbers.appendChild(pageBtn);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.allImages.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lightbox
  window.lightbox = new Lightbox();
  
  // Initialize contact form
  window.contactForm = new ContactForm();
  
  // Initialize gallery pagination (only on gallery page)
  if ($('#galleryGrid')) {
    window.galleryPagination = new GalleryPagination();
  }
});
