/* -------------------------------------------------------------------
   Aya Car Trading | معرض آية لتجارة السيارات
   Scroll Reveal Animations, Counters & Countdown Timers Engine
------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initOfferCountdown();
  initHeroTaglineTyping();
});

/* Intersection Observer Scroll Reveal */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => observer.observe(el));
}

/* Numeric Counter Animation */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 60));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = prefix + new Intl.NumberFormat().format(current) + suffix;
        }, 30);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* Countdown Timer for Special Offers */
function initOfferCountdown() {
  const timerContainers = document.querySelectorAll('[data-countdown]');

  timerContainers.forEach(container => {
    const targetDateStr = container.getAttribute('data-countdown') || '2026-12-31';
    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = container.querySelector('.cd-days');
    const hoursEl = container.querySelector('.cd-hours');
    const minsEl = container.querySelector('.cd-mins');
    const secsEl = container.querySelector('.cd-secs');

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
      if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
      if (minsEl) minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      if (secsEl) secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  });
}

/* -------------------------------------------------------------------
   Luxury Cinematic Hero Tagline Typing Animation
   - Pure HTML5 + CSS3 + Vanilla JavaScript (No external libraries)
   - 60 FPS requestAnimationFrame engine
   - Preserves Arabic RTL letter shaping & ligatures
   - Golden glow pulse on completion & persistent blinking cursor
------------------------------------------------------------------- */
function initHeroTaglineTyping() {
  const taglineEl = document.querySelector('.hero-owner-tagline');
  if (!taglineEl) return;

  // Customization Configuration
  const config = {
    // Primary Arabic Tagline text
    textAr: "أبو موسى لديكم لا خوف عليكم",
    textEn: "Abu Musa... With us, you have no fears",
    
    // Speed settings in milliseconds per character (Slower & more majestic speed)
    typeSpeedMin: 110,    // Typing speed min (110-140 ms per char)
    typeSpeedMax: 140,    // Typing speed max (110-140 ms per char)
    deleteSpeedMin: 55,   // Deleting speed min (55-75 ms per char)
    deleteSpeedMax: 75,   // Deleting speed max (55-75 ms per char)
    
    // Pause intervals in milliseconds
    pauseEnd: 2500,       // 2.5 seconds pause after sentence is fully typed
    pauseStart: 700       // 700ms pause after text is fully deleted
  };

  // Remove data-i18n attribute to prevent standard text content overwrite
  taglineEl.removeAttribute('data-i18n');

  // Build clean DOM structure
  let textSpan = taglineEl.querySelector('.tagline-text');
  let cursorSpan = taglineEl.querySelector('.tagline-cursor');

  if (!textSpan || !cursorSpan) {
    taglineEl.innerHTML = '';
    textSpan = document.createElement('span');
    textSpan.className = 'tagline-text';
    cursorSpan = document.createElement('span');
    cursorSpan.className = 'tagline-cursor';
    cursorSpan.setAttribute('aria-hidden', 'true');
    taglineEl.appendChild(textSpan);
    taglineEl.appendChild(cursorSpan);
  }

  // Resolve active language text target
  function getActiveText() {
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    return lang === 'en' ? config.textEn : config.textAr;
  }

  // Natural speed variation generator
  function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;
  let lastTime = 0;
  let currentDelay = getRandomDelay(config.typeSpeedMin, config.typeSpeedMax);

  function animateTagline(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    if (elapsed >= currentDelay && !isPaused) {
      lastTime = timestamp;
      const targetText = getActiveText();

      if (!isDeleting) {
        // Typing phase: character by character right-to-left
        charIndex++;
        textSpan.textContent = targetText.slice(0, charIndex);

        // Micro-animation entry effect trigger
        textSpan.classList.add('typing-char-active');
        setTimeout(() => textSpan.classList.remove('typing-char-active'), 150);

        if (charIndex >= targetText.length) {
          // Sentence fully typed -> trigger golden glow pulse & 2.5s pause
          isPaused = true;
          textSpan.classList.add('glow-pulse');

          setTimeout(() => {
            textSpan.classList.remove('glow-pulse');
            isDeleting = true;
            isPaused = false;
            currentDelay = getRandomDelay(config.deleteSpeedMin, config.deleteSpeedMax);
            lastTime = performance.now();
          }, config.pauseEnd);
        } else {
          currentDelay = getRandomDelay(config.typeSpeedMin, config.typeSpeedMax);
        }
      } else {
        // Deleting phase: character by character left-to-right
        charIndex--;
        textSpan.textContent = targetText.slice(0, charIndex);

        if (charIndex <= 0) {
          // Text fully erased -> trigger brief 700ms pause
          isPaused = true;
          
          setTimeout(() => {
            isDeleting = false;
            isPaused = false;
            currentDelay = getRandomDelay(config.typeSpeedMin, config.typeSpeedMax);
            lastTime = performance.now();
          }, config.pauseStart);
        } else {
          currentDelay = getRandomDelay(config.deleteSpeedMin, config.deleteSpeedMax);
        }
      }
    }

    requestAnimationFrame(animateTagline);
  }

  // Observe HTML lang attribute for dynamic language switching
  const langObserver = new MutationObserver(() => {
    const newTarget = getActiveText();
    if (charIndex > newTarget.length) {
      charIndex = newTarget.length;
    }
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // Start requestAnimationFrame loop
  requestAnimationFrame(animateTagline);
}

