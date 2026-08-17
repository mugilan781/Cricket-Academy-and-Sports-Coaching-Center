/* ===================================================
   CRICKET ACADEMY — MAIN JAVASCRIPT
   Core functionality: Navbar, Theme, RTL, Transitions
   =================================================== */

'use strict';

/* ── Utility ────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ── Page Transition ─────────────────────────────────── */
function initPageTransitions() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;

  // Fade in on load
  window.addEventListener('load', () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.style.display = 'none', 500);
  });

  // Fade out on navigation
  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || href.startsWith('javascript') ||
        link.target === '_blank') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.display = 'flex';
      overlay.classList.add('active');
      setTimeout(() => window.location.href = href, 400);
    });
  });
}

/* ── Navbar ─────────────────────────────────────────── */
function initNavbar() {
  const navbar = $('.navbar');
  if (!navbar) return;

  const hamburger = $('.hamburger');
  const mobileNav = $('.mobile-nav');
  const overlay = $('.overlay');

  // Scroll behavior
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    const btt = $('.back-to-top');
    if (btt) btt.classList.toggle('show', window.scrollY > 400);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (hamburger && mobileNav) {
    const toggleMenu = () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      overlay?.classList.toggle('show', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', toggleMenu);
  }

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || href === `./${currentPath}`) {
      link.classList.add('active');
    }
  });

  // Back to top
  const btt = $('.back-to-top');
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Theme Toggle ─────────────────────────────────────── */
function initTheme() {
  const savedTheme = localStorage.getItem('ca-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  $$('.theme-toggle').forEach(btn => {
    updateThemeIcon(btn, savedTheme);
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ca-theme', next);
      $$('.theme-toggle').forEach(b => updateThemeIcon(b, next));
    });
  });

  function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === 'dark'
      ? '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg class="ic ic-fill" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.setAttribute('aria-label', btn.title);
  }
}

/* ── RTL Toggle ─────────────────────────────────────────── */
function initRTL() {
  const savedDir = localStorage.getItem('ca-dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  $$('.rtl-toggle').forEach(btn => {
    updateRTLLabel(btn, savedDir);
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir');
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('ca-dir', next);
      $$('.rtl-toggle').forEach(b => updateRTLLabel(b, next));
    });
  });

  function updateRTLLabel(btn, dir) {
    btn.textContent = dir === 'ltr' ? 'عر' : 'EN';
    btn.title = dir === 'ltr' ? 'Switch to RTL' : 'Switch to LTR';
    btn.setAttribute('aria-label', btn.title);
  }
}

/* ── Scroll Reveal ─────────────────────────────────────── */
function initScrollReveal() {
  const els = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Animated Counters ─────────────────────────────────── */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.dataset.count.includes('.');
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      const start = performance.now();

      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── Hero Slider ─────────────────────────────────────── */
function initHeroSlider() {
  const slider = $('.hero-slider');
  if (!slider) return;

  const slides = $$('.hero-slide', slider);
  const dotsContainer = $('.slider-dots');
  const prevBtn = $('#sliderPrev');
  const nextBtn = $('#sliderNext');
  let current = 0;
  let timer;

  if (!slides.length) return;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer?.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    $$('.slider-dot', dotsContainer)[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    $$('.slider-dot', dotsContainer)[current]?.classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe
  let startX = 0;
  slider.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  goTo(0);
}

/* ── FAQ Accordion ─────────────────────────────────────── */
function initFAQ() {
  $$('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    q?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close others
      $$('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ── Tabs ─────────────────────────────────────────────── */
function initTabs() {
  $$('.tabs').forEach(tabGroup => {
    const btns = $$('.tab-btn', tabGroup);
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const panel = $(`#${target}`);
        if (!panel) return;

        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const allPanels = $$('.tab-panel', btn.closest('.tabs-wrapper') || document);
        allPanels.forEach(p => p.classList.remove('active'));
        panel.classList.add('active');
      });
    });
  });
}

/* ── Toast Notification ─────────────────────────────── */
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer') ||
    (() => {
      const c = document.createElement('div');
      c.id = 'toastContainer';
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();

  const icons = {
    success: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M9 11l3 3L22 4"/></svg>',
    error: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    info: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 18h6M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>',
    warning: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/></svg>'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ── Form Validation ────────────────────────────────── */
function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.required;
  const errorEl = document.getElementById(`${input.id}Error`);
  let isValid = true;
  let message = '';

  if (required && !value) {
    isValid = false;
    message = 'This field is required.';
  } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    isValid = false;
    message = 'Please enter a valid email address.';
  } else if (type === 'tel' && value && !/^[\+]?[\d\s\-\(\)]{8,15}$/.test(value)) {
    isValid = false;
    message = 'Please enter a valid phone number.';
  } else if (input.minLength > 0 && value.length < input.minLength) {
    isValid = false;
    message = `Minimum ${input.minLength} characters required.`;
  }

  input.classList.toggle('error', !isValid);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.toggle('show', !isValid);
  }
  return isValid;
}

function initForms() {
  $$('form[data-validate]').forEach(form => {
    const inputs = $$('input, textarea, select', form);

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const allValid = inputs.every(inp => validateField(inp));
      if (allValid) {
        showToast('Message sent successfully! We\'ll be in touch soon.', 'success');
        form.reset();
      } else {
        showToast('Please fix the errors and try again.', 'error');
      }
    });
  });
}

/* ── Progress Bars ──────────────────────────────────── */
function initProgressBars() {
  const bars = $$('[data-progress]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const fill = bar.querySelector('.progress-fill');
      if (fill) {
        setTimeout(() => {
          fill.style.width = bar.dataset.progress + '%';
        }, 200);
      }
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

/* ── Gallery Lightbox ──────────────────────────────── */
function initGallery() {
  const galleryItems = $$('[data-lightbox]');
  if (!galleryItems.length) return;

  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.95);
    z-index:5000;display:none;align-items:center;justify-content:center;
    backdrop-filter:blur(10px);
  `;
  lightbox.innerHTML = `
    <button id="lbClose" style="position:absolute;top:20px;right:20px;background:none;border:none;
      color:#F7F8F5;font-size:1.8rem;cursor:pointer;z-index:1;"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <button id="lbPrev" style="position:absolute;left:20px;background:rgba(255,255,255,0.1);
      border:1px solid rgba(255,255,255,0.2);color:#F7F8F5;width:48px;height:48px;border-radius:50%;
      cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;">←</button>
    <img id="lbImg" style="max-width:90vw;max-height:85vh;border-radius:12px;object-fit:contain;" src="" alt="">
    <button id="lbNext" style="position:absolute;right:20px;background:rgba(255,255,255,0.1);
      border:1px solid rgba(255,255,255,0.2);color:#F7F8F5;width:48px;height:48px;border-radius:50%;
      cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;">→</button>
  `;
  document.body.appendChild(lightbox);

  let current = 0;
  const imgs = galleryItems.map(i => ({ src: i.dataset.lightbox, alt: i.alt || '' }));

  const open = (i) => {
    current = i;
    document.getElementById('lbImg').src = imgs[i].src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, i) => item.addEventListener('click', () => open(i)));
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => open((current - 1 + imgs.length) % imgs.length));
  document.getElementById('lbNext').addEventListener('click', () => open((current + 1) % imgs.length));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open((current - 1 + imgs.length) % imgs.length);
      if (e.key === 'ArrowRight') open((current + 1) % imgs.length);
    }
  });
}

/* ── Sticky Active Nav on Scroll ──────────────────── */
function initSectionSpy() {
  const sections = $$('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        $$('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ── Parallax ────────────────────────────────────────── */
function initParallax() {
  const els = $$('[data-parallax]');
  if (!els.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* ── Init All ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initRTL();
  initScrollReveal();
  initCounters();
  initHeroSlider();
  initFAQ();
  initTabs();
  initForms();
  initProgressBars();
  initGallery();
  initSectionSpy();
  initParallax();
  initPageTransitions();
});
