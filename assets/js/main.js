// Karl Keel Pottery — site behaviour
// Lightbox (with prev/next, keyboard and swipe), contact dialog, small polish.

document.documentElement.classList.add('js');

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

// Keep keyboard focus inside an open overlay.
function trapFocus(container, e) {
  if (e.key !== 'Tab') return;
  const items = $$(FOCUSABLE, container).filter(el => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ------------------------------------------------------------------------ */
/* Lightbox                                                                  */
/* ------------------------------------------------------------------------ */
class Lightbox {
  constructor(el) {
    this.el = el;
    this.img = $('#lightboxImage', el);
    this.caption = $('#lightboxCaption', el);
    this.prevBtn = $('.lb-prev', el);
    this.nextBtn = $('.lb-next', el);
    this.triggers = $$('[data-full]');
    this.index = 0;
    this.lastFocus = null;
    if (!this.triggers.length) return;

    this.triggers.forEach((t, i) => t.addEventListener('click', () => this.open(i)));
    $('.lb-close', el).addEventListener('click', () => this.close());
    this.prevBtn.addEventListener('click', () => this.go(-1));
    this.nextBtn.addEventListener('click', () => this.go(1));

    el.addEventListener('click', e => {
      if (e.target === el || e.target.tagName === 'FIGURE') this.close();
    });

    document.addEventListener('keydown', e => {
      if (!this.isOpen()) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.go(-1);
      else if (e.key === 'ArrowRight') this.go(1);
      else trapFocus(el, e);
    });

    // Swipe left/right on touch screens.
    let x0 = null;
    el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) this.go(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  isOpen() { return this.el.classList.contains('active'); }

  open(i) {
    this.lastFocus = document.activeElement;
    this.el.classList.add('active');
    this.el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    this.show(i);
    $('.lb-close', this.el).focus();
  }

  close() {
    this.el.classList.remove('active');
    this.el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    this.img.removeAttribute('src');
    if (this.lastFocus) this.lastFocus.focus();
  }

  go(step) {
    const n = this.triggers.length;
    if (n < 2) return;
    this.show((this.index + step + n) % n);
  }

  show(i) {
    this.index = i;
    const t = this.triggers[i];
    const thumb = $('img', t);
    const n = this.triggers.length;

    this.img.src = t.dataset.full;
    this.img.alt = thumb ? thumb.alt : '';

    const title = t.dataset.title;
    this.caption.innerHTML = '';
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      this.caption.append(strong, t.dataset.year || '');
    } else {
      this.caption.textContent = `${i + 1} / ${n}`;
    }

    const multi = n > 1;
    this.prevBtn.hidden = !multi;
    this.nextBtn.hidden = !multi;

    // Preload neighbours so stepping through feels instant.
    if (multi) {
      [1, -1].forEach(d => { new Image().src = this.triggers[(i + d + n) % n].dataset.full; });
    }
  }
}

/* ------------------------------------------------------------------------ */
/* Contact dialog                                                            */
/* ------------------------------------------------------------------------ */
class ContactForm {
  constructor() {
    this.modal = $('#contactModal');
    this.form = $('#contactForm');
    this.message = $('#formMessage');
    this.lastFocus = null;
    if (!this.modal) return;

    $$('[data-open-contact]').forEach(b => b.addEventListener('click', () => this.open()));
    $('.close', this.modal).addEventListener('click', () => this.close());
    this.modal.addEventListener('click', e => { if (e.target === this.modal) this.close(); });
    document.addEventListener('keydown', e => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      else trapFocus(this.modal, e);
    });
    this.form.addEventListener('submit', e => this.submit(e));
  }

  open() {
    this.lastFocus = document.activeElement;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => $('#name', this.form).focus(), 50);
  }

  close() {
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    this.clearErrors();
    this.setMessage('', '');
    if (this.lastFocus) this.lastFocus.focus();
  }

  setMessage(text, type) {
    this.message.textContent = text;
    this.message.className = 'form-message' + (type ? ' ' + type : '');
  }

  clearErrors() {
    $$('.error', this.form).forEach(el => { el.classList.remove('error'); el.removeAttribute('aria-invalid'); });
    $$('.error-message', this.form).forEach(el => el.remove());
  }

  fieldError(field, text) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    const msg = document.createElement('div');
    msg.className = 'error-message';
    msg.textContent = text;
    field.after(msg);
  }

  validate() {
    this.clearErrors();
    const name = $('#name', this.form);
    const email = $('#email', this.form);
    const body = $('#message', this.form);
    const bad = [];
    if (name.value.trim().length < 2) { this.fieldError(name, 'Please enter your name.'); bad.push(name); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { this.fieldError(email, 'Please enter a valid email address.'); bad.push(email); }
    if (body.value.trim().length < 10) { this.fieldError(body, 'Please write a little more (at least 10 characters).'); bad.push(body); }
    if (bad.length) bad[0].focus();
    return !bad.length;
  }

  async submit(e) {
    e.preventDefault();
    if (!this.validate()) return;

    const btn = $('button[type="submit"]', this.form);
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const res = await fetch(this.form.action, {
        method: 'POST',
        body: new FormData(this.form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('Form submission failed');
      this.form.reset();
      this.setMessage("Thanks! Your message is on its way — I'll get back to you soon.", 'success');
      setTimeout(() => { if (this.modal.classList.contains('active')) this.close(); }, 4000);
    } catch (err) {
      console.error(err);
      this.setMessage('Sorry, something went wrong. Please try again or email karlkeel1@comcast.net directly.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send message';
    }
  }
}

/* ------------------------------------------------------------------------ */
/* Polish                                                                    */
/* ------------------------------------------------------------------------ */
function headerShadow() {
  const header = $('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 4);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function revealOnScroll() {
  const items = $$('.gallery-item');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  const lb = $('#lightbox');
  if (lb) new Lightbox(lb);
  new ContactForm();
  headerShadow();
  revealOnScroll();
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
});
