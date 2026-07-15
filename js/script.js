(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════
     VIDEO INTRO — typewriter title + autoplay + "Commencer" handoff
     (static port of video-hero.component.ts)
     ═══════════════════════════════════════════════════════════════════ */

  const INTRO_TITLE = 'Moujtahid';
  const TYPEWRITER_TEXT = 'plateforme numero 1 pour la gestion des centres scolaires';
  const TYPEWRITER_SPEED_MS = 55;
  const DELETE_SPEED_MS = 45;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function initVideoIntro() {
    const titleEl = document.getElementById('video-hero-title-text');
    const cursorEl = document.getElementById('video-hero-cursor');
    const video = document.getElementById('introVideo');
    const ctaBtn = document.getElementById('video-hero-cta');

    async function runIntroSequence() {
      titleEl.textContent = INTRO_TITLE;
      await delay(1500);
      cursorEl.classList.remove('video-hero__cursor--hidden');

      let text = INTRO_TITLE;
      for (let i = 0; i < INTRO_TITLE.length; i++) {
        await delay(DELETE_SPEED_MS);
        text = text.slice(0, -1);
        titleEl.textContent = text;
      }

      let typed = '';
      for (let i = 0; i < TYPEWRITER_TEXT.length; i++) {
        await delay(TYPEWRITER_SPEED_MS);
        typed = TYPEWRITER_TEXT.slice(0, i + 1);
        titleEl.textContent = typed;
      }

      cursorEl.classList.add('video-hero__cursor--hidden');
    }

    runIntroSequence();

    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const play = () => {
        video.play().catch(() => {
          // Some browser settings still block autoplay even when muted.
        });
      };

      video.load();
      let attempts = 0;
      const playTimer = setInterval(() => {
        play();
        attempts++;
        if (attempts >= 5) clearInterval(playTimer);
      }, 250);

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        play();
      } else {
        video.addEventListener('loadedmetadata', play, { once: true });
        video.addEventListener('loadeddata', play, { once: true });
        video.addEventListener('canplay', play, { once: true });
      }

      video.addEventListener('ended', proceedToLanding);
    }

    if (ctaBtn) ctaBtn.addEventListener('click', proceedToLanding);
  }

  let introDismissed = false;
  function proceedToLanding() {
    if (introDismissed) return;
    introDismissed = true;

    const videoWrap = document.getElementById('hero-video-wrap');
    const landing = document.getElementById('hero-landing');
    if (!videoWrap || !landing) return;

    videoWrap.classList.add('is-dismissed');
    landing.classList.add('is-dismissed');

    videoWrap.addEventListener('transitionend', () => {
      videoWrap.style.display = 'none';
    }, { once: true });
  }

  /* ═══════════════════════════════════════════════════════════════════
     LANDING PAGE INTERACTIONS
     (static port of hero.component.ts)
     ═══════════════════════════════════════════════════════════════════ */

  function initLandingPage() {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.scrollBehavior = 'smooth';

    initCharReveal();
    initNavBehavior();
    initScrollReveal();
    initSectionHandoff();
    initMagneticCards();
    initMockupParallax();
    initCounters();
    initRiskTechAnimations();
    initDemoSelects();
    initRippleButtons();
    initFaq();
    initDemoForm();
  }

  // ─── 1. Char-by-char ink reveal ─────────────────────────────────
  function initCharReveal() {
    const headline = document.getElementById('lp-headline');
    if (!headline) return;

    const line1 = 'Gérez votre centre';
    const line2Prefix = 'avec ';
    const line2Accent = 'précision.';

    let idx = 0;
    const charSpan = (ch, accent) => {
      if (ch === ' ' || ch === ' ') { idx++; return ' '; }
      return `<span class="char${accent ? ' accent' : ''}" style="--ci:${idx++}">${ch}</span>`;
    };

    const buildLine = (text, accent) =>
      text.split('').map((c) => charSpan(c, accent)).join('');

    const html =
      `<span class="hl-line">${buildLine(line1)}</span><br>` +
      `<span class="hl-line">${buildLine(line2Prefix)}${buildLine(line2Accent, true)}</span>`;

    headline.innerHTML = html;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => document.getElementById('lp-overline')?.classList.add('visible'), 60);
    setTimeout(() => {
      document.getElementById('lp-subhead')?.classList.add('visible');
      document.getElementById('lp-ctas')?.classList.add('visible');
      document.getElementById('lp-trust')?.classList.add('visible');
      document.getElementById('lp-mockup')?.classList.add('visible');
    }, reduced ? 80 : 520);
  }

  // ─── 2. Smart nav — shadow + compact + active section ───────────
  function initNavBehavior() {
    const nav = document.getElementById('lp-nav');
    const hamburger = document.getElementById('lp-hamburger');
    const mobileMenu = document.getElementById('lp-mobile-menu');
    if (!nav || !hamburger || !mobileMenu) return;

    let open = false;
    let prevY = 0;

    const links = document.querySelectorAll('.lp .nav__link');
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => {
          l.classList.toggle('nav__link--active', l.getAttribute('href') === `#${e.target.id}`);
        });
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('.lp section[id]').forEach((s) => sectionObs.observe(s));

    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      nav.classList.toggle('nav--scrolled', sy > 80);
      nav.classList.toggle('nav--compact', sy > 80 && sy > prevY);
      prevY = sy;
    }, { passive: true });

    const closeMenu = () => {
      open = false;
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
      open = !open;
      hamburger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.querySelectorAll('a').forEach((l) => l.addEventListener('click', closeMenu));
  }

  // ─── 3. Cinematic scroll-triggered section reveals ───────────────
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        setTimeout(() => el.classList.add('visible'), Number(el.dataset.delay ?? 0));
        observer.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.lp .section__header .reveal').forEach((el, i) => {
      el.dataset.delay = String(i * 100);
      observer.observe(el);
    });

    document.querySelectorAll('.lp .reveal').forEach((el) => {
      if (!el.dataset.delay && !el.closest('.section__header')) observer.observe(el);
    });

    document.querySelectorAll('.lp .bento__card').forEach((el, i) => {
      el.dataset.delay = String(i * 80);
      observer.observe(el);
    });

    document.querySelectorAll('.lp .step').forEach((el, i) => {
      el.dataset.delay = String(i * 100);
      observer.observe(el);
    });

    document.querySelectorAll('.lp .risk-flow > .reveal, .lp .risk-update').forEach((el, i) => {
      el.dataset.delay = String(i * 130);
      observer.observe(el);
    });

    document.querySelectorAll('.lp .excel-shift .reveal').forEach((el, i) => {
      el.dataset.delay = String(i * 120);
      observer.observe(el);
    });

    document.querySelectorAll('.lp .demo-request .reveal').forEach((el, i) => {
      el.dataset.delay = String(i * 140);
      observer.observe(el);
    });

    document.querySelectorAll('.lp .t-card').forEach((el, i) => {
      el.dataset.delay = String(i * 120);
      observer.observe(el);
    });

    document.querySelectorAll('.lp .p-card').forEach((el, i) => {
      el.dataset.delay = String(i * 80);
      observer.observe(el);
    });
  }

  // ─── 4. Section handoff parallax ────────────────────────────────
  let sectionRafHandle = 0;
  function initSectionHandoff() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = Array.from(
      document.querySelectorAll('.lp main > section:not(.hero), .lp main > .social-proof')
    );
    if (!sections.length) return;

    sections.forEach((section, index) => {
      section.classList.add('section-handoff');
      section.style.setProperty('--handoff-z', String(index + 1));
    });

    const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
    const easeOutQuint = (value) => 1 - Math.pow(1 - value, 5);

    const update = () => {
      const viewport = window.innerHeight || 1;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const enter = clamp((viewport - rect.top) / (viewport * 0.74));
        const exit = clamp((rect.top + rect.height - viewport * 0.16) / (viewport * 0.84));
        const presence = clamp(Math.min(enter, exit));
        const easedPresence = easeOutQuint(presence);
        const liftingIn = 1 - easedPresence;
        const leaving = clamp((viewport * 0.12 - rect.bottom) / (viewport * 0.52));

        const y = liftingIn * 54 - leaving * 36;
        const scale = 0.955 + easedPresence * 0.045 - leaving * 0.018;
        const opacity = 0.48 + easedPresence * 0.52 - leaving * 0.18;
        const blur = liftingIn * 8 + leaving * 3;

        section.style.setProperty('--handoff-y', `${y.toFixed(2)}px`);
        section.style.setProperty('--handoff-scale', scale.toFixed(4));
        section.style.setProperty('--handoff-opacity', clamp(opacity, 0.28, 1).toFixed(3));
        section.style.setProperty('--handoff-blur', `${blur.toFixed(2)}px`);
      });

      sectionRafHandle = 0;
    };

    const requestUpdate = () => {
      if (sectionRafHandle) return;
      sectionRafHandle = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    requestUpdate();
  }

  // ─── 5. Magnetic hover on bento cards ───────────────────────────
  function initMagneticCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.lp .bento__card').forEach((card) => {
      const icon = card.querySelector('.bento__icon');

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 120ms linear, border-color 200ms, box-shadow 200ms';
        card.style.willChange = 'transform';
      });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
        card.style.transform =
          `perspective(900px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateZ(6px)`;
        card.style.borderColor = 'rgba(0,113,227,0.28)';
        if (icon) icon.style.transform = `translate(${dx * -3}px,${dy * -3}px)`;
      });

      card.addEventListener('mouseleave', () => {
        const spring = 'transform 600ms cubic-bezier(0.23,1,0.32,1), border-color 300ms, box-shadow 300ms';
        card.style.transition = spring;
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.borderColor = '';
        if (icon) {
          icon.style.transition = 'transform 600ms cubic-bezier(0.23,1,0.32,1)';
          icon.style.transform = '';
        }
        setTimeout(() => {
          card.style.transition = '';
          card.style.willChange = '';
          if (icon) icon.style.transition = '';
        }, 620);
      });
    });
  }

  // ─── 6. Hero mockup parallax ────────────────────────────────────
  function initMockupParallax() {
    const wrap = document.getElementById('lp-mockup');
    const inner = wrap?.querySelector('.mockup__content');
    if (!wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tY = 0, cY = 0;
    let tR = 0, cR = 0;
    let tIY = 0, cIY = 0;
    const L = 0.08;

    let rafHandle = 0;
    const tick = () => {
      cY += (tY - cY) * L;
      cR += (tR - cR) * L;
      cIY += (tIY - cIY) * L;

      wrap.style.transform = `translateY(${cY}px) rotateY(${cR}deg)`;
      if (inner) inner.style.transform = `translateY(${cIY}px)`;

      rafHandle = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      tY = sy * 0.15;
      tR = -Math.min((sy / 400) * 3, 3);
      tIY = -(sy * 0.07);
    }, { passive: true });

    setTimeout(() => {
      wrap.style.transition = 'none';
      rafHandle = requestAnimationFrame(tick);
    }, 950);
  }

  // ─── 7. Number counter — easeOutExpo via RAF ────────────────────
  function initCounters() {
    const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const runCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix ?? '';

      if (reduced) {
        el.textContent = target.toLocaleString('fr-FR') + suffix;
        return;
      }

      const inHero = !!el.closest('#lp-mockup');
      const delayMs = inHero ? 900 : 0;
      const duration = 1800;

      setTimeout(() => {
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const val = Math.round(target * easeOutExpo(p));
          el.textContent = val.toLocaleString('fr-FR') + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, delayMs);
    };

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.lp [data-count]').forEach((el) => {
      el.textContent = '0' + (el.dataset.suffix ?? '');
      obs.observe(el);
    });
  }

  function initRiskTechAnimations() {
    const section = document.querySelector('.lp .risk-tech');
    if (!section) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        section.classList.add('risk-tech--active');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.28, rootMargin: '0px 0px -80px 0px' });

    obs.observe(section);
  }

  function initDemoSelects() {
    const selects = Array.from(document.querySelectorAll('.lp [data-demo-select]'));
    if (!selects.length) return;

    const closeAll = (except) => {
      selects.forEach((select) => {
        if (select === except) return;
        select.classList.remove('is-open');
        select.querySelector('.demo-select__trigger')?.setAttribute('aria-expanded', 'false');
      });
    };

    selects.forEach((select) => {
      const trigger = select.querySelector('.demo-select__trigger');
      const value = select.querySelector('.demo-select__value');
      const input = select.querySelector('input[type="hidden"]');
      const options = Array.from(select.querySelectorAll('.demo-select__option'));
      if (!trigger || !value || !input || !options.length) return;

      trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const nextOpen = !select.classList.contains('is-open');
        closeAll(select);
        select.classList.toggle('is-open', nextOpen);
        trigger.setAttribute('aria-expanded', String(nextOpen));
      });

      options.forEach((option) => {
        option.setAttribute('aria-selected', 'false');
        option.addEventListener('click', (event) => {
          event.stopPropagation();
          const selected = option.dataset.value ?? option.textContent.trim() ?? '';
          input.value = selected;
          value.textContent = selected;
          value.classList.remove('demo-select__value--placeholder');
          options.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
          closeAll();
        });
      });

      select.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeAll();
      });
    });

    document.addEventListener('click', (event) => {
      if (selects.some((select) => select.contains(event.target))) return;
      closeAll();
    });
  }

  // ─── Demo form — fake submit (no backend wired up) ──────────────
  function initDemoForm() {
    const form = document.getElementById('demo-form');
    const fields = document.getElementById('demo-form__fields');
    const success = document.getElementById('demo-form__success');
    const submitBtn = document.getElementById('demo-form__submit-btn');
    const submitLabel = document.getElementById('demo-form__submit-label');
    if (!form) return;

    let submitting = false;
    let submitted = false;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (submitting || submitted) return;

      submitting = true;
      submitBtn.disabled = true;
      submitLabel.textContent = 'Envoi en cours…';

      // TODO: brancher l'API d'envoi des demandes de démo.
      setTimeout(() => {
        submitting = false;
        submitted = true;
        fields.hidden = true;
        success.hidden = false;
      }, 700);
    });
  }

  // ─── 8. Liquid ripple on primary CTAs ───────────────────────────
  function initRippleButtons() {
    const sel = '.lp .btn-primary, .lp .btn-primary--white, .lp .btn-pricing--filled';
    document.querySelectorAll(sel).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const { clientX, clientY } = e;
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.cssText = `left:${clientX - r.left}px;top:${clientY - r.top}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });
  }

  function initFaq() {
    document.querySelectorAll('.lp .faq__trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq__item');
        if (!item) return;
        const isOpen = item.classList.contains('faq__item--open');
        document.querySelectorAll('.lp .faq__item').forEach((i) => {
          i.classList.remove('faq__item--open');
          i.querySelector('.faq__trigger')?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('faq__item--open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initVideoIntro();
    initLandingPage();
  });
})();
