(function () {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');
  const themeSections = document.querySelectorAll('[data-nav-theme]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lenis = null;

  function setNavTone(tone) {
    if (!nav) return;
    nav.dataset.tone = tone;
  }

  function getScrollY() {
    return lenis ? lenis.scroll : window.scrollY;
  }

  function updateNavTone() {
    const navHeight = nav?.offsetHeight ?? 0;
    const y = getScrollY() + navHeight + 48;
    let tone = 'dark';

    themeSections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (y >= top && y < bottom) {
        tone = section.dataset.navTheme === 'light' ? 'light' : 'dark';
      }
    });

    setNavTone(tone);
  }

  function initSmoothScroll() {
    if (reducedMotion || typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    document.documentElement.classList.add('lenis', 'lenis-smooth');

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', updateNavTone);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -100, duration: 1.4 });
      });
    });
  }

  function initVideos() {
    document.querySelectorAll('.media-bg').forEach((wrap) => {
      const video = wrap.querySelector('video');
      if (!video) return;

      const markPlaying = () => wrap.classList.add('is-playing');

      if (reducedMotion) {
        video.pause();
        video.removeAttribute('autoplay');
        return;
      }

      video.addEventListener('playing', markPlaying);
      video.addEventListener('canplay', () => {
        video.play().then(markPlaying).catch(() => {
          wrap.classList.remove('is-playing');
        });
      });
      video.addEventListener('error', () => wrap.classList.remove('is-playing'));

      if (video.readyState >= 2) {
        video.play().then(markPlaying).catch(() => {});
      }
    });
  }

  /** Amrit-style: split display lines into characters, stagger from below */
  function splitHeroText() {
    document.querySelectorAll('.hero-split').forEach((el) => {
      const lineDelay = Number(el.dataset.delay || 0) * 0.12;
      el.style.setProperty('--line-delay', `${lineDelay}s`);

      const text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-hidden', 'true');

      let charIndex = 0;
      [...text].forEach((ch) => {
        const outer = document.createElement('span');
        outer.className = 'char';
        if (ch === ' ') {
          outer.innerHTML = '&nbsp;';
          outer.style.width = '0.28em';
        } else {
          const inner = document.createElement('span');
          inner.textContent = ch;
          outer.style.setProperty('--char-i', String(charIndex));
          outer.appendChild(inner);
          charIndex += 1;
        }
        el.appendChild(outer);
      });
    });
  }

  function initHeroMotion() {
    splitHeroText();

    document.querySelectorAll('.hero-anim').forEach((el) => {
      const delay = Number(el.dataset.delay || 0) * 0.12 + 0.35;
      el.style.setProperty('--anim-delay', `${delay}s`);
    });

    requestAnimationFrame(() => {
      document.body.classList.add('is-ready');
      document.querySelectorAll('.hero-split, .hero-anim').forEach((el) => {
        el.classList.add('is-in');
      });
    });
  }

  function initReveals() {
    const scrollItems = document.querySelectorAll('.reveal');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      scrollItems.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    scrollItems.forEach((el) => io.observe(el));
  }

  function openDrawer() {
    drawer?.classList.add('is-open');
    drawer?.setAttribute('aria-hidden', 'false');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    lenis?.stop();
  }

  function closeDrawer() {
    drawer?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden', 'true');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    lenis?.start();
  }

  toggle?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeDrawer));

  if (!lenis) {
    window.addEventListener('scroll', updateNavTone, { passive: true });
  }
  window.addEventListener('resize', updateNavTone, { passive: true });

  initSmoothScroll();
  initVideos();
  if (reducedMotion) {
    document.body.classList.add('is-ready');
    document.querySelectorAll('.hero-split, .hero-anim').forEach((el) => el.classList.add('is-in'));
  } else {
    initHeroMotion();
  }
  initReveals();
  updateNavTone();
})();
