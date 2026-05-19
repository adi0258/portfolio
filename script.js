/* =========================================================
   Adi Tapiero — Portfolio
   Theme toggle, nav state, mobile menu, smooth scroll,
   active section highlight, reveal-on-scroll.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Theme toggle (no localStorage) ----------
     Initial theme follows the user's OS preference at page load.
     The toggle then flips the current theme. */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      themeToggle.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    });
  }

  /* ---------- 3. Sticky navbar shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  const closeMenu = () => {
    if (!hamburger || !navLinksEl) return;
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  };

  const openMenu = () => {
    if (!hamburger || !navLinksEl) return;
    hamburger.classList.add('open');
    navLinksEl.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
  };

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      if (navLinksEl.classList.contains('open')) closeMenu();
      else openMenu();
    });

    // Close menu when a link is tapped
    navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinksEl.classList.contains('open')) return;
      const target = e.target;
      if (!navLinksEl.contains(target) && !hamburger.contains(target)) {
        closeMenu();
      }
    });

    // Close on resize up to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 5. Active nav link highlight on scroll ---------- */
  const sections = ['about', 'skills', 'projects', 'experience', 'education', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinkMap = new Map();
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) navLinkMap.set(href.slice(1), link);
  });

  if ('IntersectionObserver' in window && sections.length) {
    const setActive = (id) => {
      navLinkMap.forEach((link, key) => {
        if (key === id) link.classList.add('active');
        else link.classList.remove('active');
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0, 0.15, 0.4, 0.75, 1],
      }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ---------- 6. Reveal-on-scroll using IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback — show everything if IO is unavailable
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 7. Smooth scroll for in-page anchors ----------
     CSS handles this via scroll-behavior; this is a small JS
     fallback for browsers / cases where it's blocked, and it
     also accounts for the sticky navbar offset. */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = navbar ? navbar.offsetHeight : 72;
      const y = target.getBoundingClientRect().top + window.pageYOffset - navH + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
