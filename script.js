/* ============================================================
   JONATHAN DAVID — PORTFOLIO JAVASCRIPT
   Particle BG | Typing Effect | Scroll Animations | Loader
   ============================================================ */

'use strict';

/* ── LOADER ───────────────────────────────────────────────── */
(function initLoader() {
  const loader     = document.getElementById('loader');
  const progress   = document.getElementById('loaderProgress');
  const loaderText = document.getElementById('loaderText');

  const messages = [
    'Initializing AI Systems...',
    'Loading Neural Networks...',
    'Calibrating Data Models...',
    'Rendering Portfolio...',
    'Ready 🚀'
  ];

  let pct = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18 + 4, 100);
    progress.style.width = pct + '%';

    const newIdx = Math.floor((pct / 100) * (messages.length - 1));
    if (newIdx !== msgIdx && newIdx < messages.length) {
      msgIdx = newIdx;
      loaderText.textContent = messages[msgIdx];
    }

    if (pct >= 100) {
      clearInterval(interval);
      loaderText.textContent = messages[messages.length - 1];
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 500);
    }
  }, 80);

  document.body.style.overflow = 'hidden';
})();


/* ── PARTICLE CANVAS ──────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animId;
  let W, H;

  const CONFIG = {
    count:          90,
    maxRadius:      2,
    minRadius:      0.5,
    speed:          0.25,
    connectionDist: 130,
    colors:         ['#7c3aed', '#06b6d4', '#a855f7', '#22d3ee', '#ec4899'],
    mouseRadius:    120,
  };

  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed * 2,
      vy: (Math.random() - 0.5) * CONFIG.speed * 2,
      r:  Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
    };
  }

  function init() {
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      // Bounce walls
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const cdx = p.x - q.x;
        const cdy = p.y - q.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < CONFIG.connectionDist) {
          const opacity = (1 - cdist / CONFIG.connectionDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${hexToRgb(p.color)},${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  init();
  draw();
})();


/* ── NAVBAR ───────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll effect
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Back to top button
    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ── BACK TO TOP ──────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ── TYPING EFFECT ────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'AI Systems',
    'ML Models',
    'Fraud Detectors',
    'Malware Scanners',
    'NLP Pipelines',
    'FastAPI Backends',
    'Data Dashboards',
    'LLM Applications',
    'Intelligent Tools',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let delay      = 110;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      delay = 55;
    } else {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      delay = 110;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 900);
})();


/* ── SCROLL REVEAL ────────────────────────────────────────── */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children within the same parent
        const delay = Array.from(entry.target.parentElement?.children ?? [])
          .indexOf(entry.target) * 80;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


/* ── SKILL BARS ───────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width + '%';
        // Slight delay for visual drama
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ── FOOTER YEAR ──────────────────────────────────────────── */
(function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── CONTACT FORM ─────────────────────────────────────────── */
(function initContactForm() {

  /* =========================================================
     ✏️  FILL IN YOUR KEYS HERE AFTER SETUP
     ---------------------------------------------------------
     EMAILJS  →  https://www.emailjs.com
       1. Sign up → connect your Gmail
       2. Create an Email Template with these variables:
             {{from_name}}  {{from_email}}  {{subject}}  {{message}}
       3. Paste your IDs below

     CALLMEBOT (WhatsApp Business notification)
       1. Open WhatsApp Business → add +34 644 82 01 05
       2. Send: "I allow callmebot to send me messages"
       3. Paste the API key you receive below
     ========================================================= */
  const CONFIG = {
    emailjs: {
      publicKey:   'N5ObeB7aEKvWBv8Ut',      // EmailJS Public Key
      serviceId:   'service_y2pe3gh',          // EmailJS Service ID
      templateId:  'template_opk6z4s',         // EmailJS Template ID
    },
    whatsapp: {
      phone:       '919959726166',             // country code + number, no +
      apiKey:      'YOUR_CALLMEBOT_API_KEY',   // ← paste CallMeBot key here
    },
  };

  /* ── helpers ── */
  function isConfigured(val) {
    return val && !val.startsWith('YOUR_');
  }

  function sendWhatsApp(name, email, subject) {
    if (!isConfigured(CONFIG.whatsapp.apiKey)) return Promise.resolve();
    const text = encodeURIComponent(
      `📬 New Portfolio Message!\n` +
      `👤 Name: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📌 Subject: ${subject}`
    );
    const url =
      `https://api.callmebot.com/whatsapp.php` +
      `?phone=${CONFIG.whatsapp.phone}` +
      `&text=${text}` +
      `&apikey=${CONFIG.whatsapp.apiKey}`;

    // Use no-cors because CallMeBot doesn't send CORS headers;
    // the request still goes through, we just can't read the response.
    return fetch(url, { method: 'GET', mode: 'no-cors' });
  }

  /* ── main ── */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  // Initialise EmailJS once
  if (isConfigured(CONFIG.emailjs.publicKey)) {
    emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const subject = document.getElementById('formSubject').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    // ── Validation ──
    if (!name || !email || !subject || !message) {
      note.textContent = '⚠️ Please fill in all fields.';
      note.className   = 'form-note error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = '⚠️ Please enter a valid email address.';
      note.className   = 'form-note error';
      return;
    }

    // ── UI: loading state ──
    const btn = document.getElementById('formSubmit');
    btn.disabled    = true;
    btn.textContent = 'Sending…';
    note.textContent = '';
    note.className   = 'form-note';

    // ── Guard: keys not yet configured ──
    if (!isConfigured(CONFIG.emailjs.publicKey) ||
        !isConfigured(CONFIG.emailjs.serviceId) ||
        !isConfigured(CONFIG.emailjs.templateId)) {
      setTimeout(() => {
        note.innerHTML  = '⚙️ Almost there! Fill in your API keys in <code>script.js</code> (see the CONFIG block near the contact form section).';
        note.className  = 'form-note error';
        btn.disabled    = false;
        btn.textContent = 'Send Message 🚀';
      }, 600);
      return;
    }

    try {
      // ── 1. Send Email via EmailJS ──
      await emailjs.send(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        { name: name, email: email, title: subject, message: message }
      );

      // ── 2. Send WhatsApp notification via CallMeBot ──
      //    (fire-and-forget; errors won't block the success message)
      sendWhatsApp(name, email, subject).catch(() => {});

      // ── Success ──
      note.textContent = '✅ Message sent! I\'ll get back to you soon.';
      note.className   = 'form-note success';
      form.reset();

    } catch (err) {
      console.error('EmailJS error:', err);
      note.textContent = '❌ Something went wrong. Please email me directly at jd20040319@gmail.com';
      note.className   = 'form-note error';
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Send Message 🚀';
    }
  });
})();


/* ── SMOOTH ANCHOR SCROLL ─────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight ?? 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── CURSOR GLOW ──────────────────────────────────────────── */
(function initCursorGlow() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


/* ── PROJECT CARD TILT ────────────────────────────────────── */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card, .cert-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -6;
      const tiltY  = dx *  6;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.05s ease, border-color 0.3s, box-shadow 0.3s';
    });
  });
})();


/* ── STATS COUNTER ANIMATION ──────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  function animateCounter(el) {
    const raw   = el.textContent.trim();
    const num   = parseFloat(raw);
    const suffix = raw.replace(/[\d.]/g, '');
    if (isNaN(num)) return;

    const duration = 1800;
    const steps    = 60;
    const increment= num / steps;
    let   current  = 0;
    let   step     = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, num);
      const display = Number.isInteger(num) ? Math.round(current) : current.toFixed(0);
      el.textContent = display + suffix;
      if (step >= steps) {
        el.textContent = num + suffix;
        clearInterval(timer);
      }
    }, duration / steps);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
