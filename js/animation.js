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
   Luxury Cinematic Hero Typing Animation — 3-Phase Sequential Engine
   Phase 1: كتابة نص الـ badge مرة واحدة
   Phase 2: كتابة عنوان الهيرو مرة واحدة
   Phase 3: نص أبو موسى يُكتب ويُمحى بشكل متكرر
------------------------------------------------------------------- */
function initHeroTaglineTyping() {
  const badgeSpan      = document.querySelector('.hero-badge span[data-i18n="hero_subtitle"]');
  const titleEl        = document.querySelector('.hero-title');
  const taglineEl      = document.querySelector('.hero-owner-tagline');
  if (!taglineEl) return;

  // ---- نصوص ثابتة لكل مرحلة ----
  const badgeTextAr  = 'معرض آية لتجارة السيارات - خيارك الأول للسيارات الفاخرة';
  const badgeTextEn  = 'Aya Car Trading - Your First Choice for Luxury Cars';
  const titleTextAr  = 'الفخامة والأداء في مكان واحد';
  const titleTextEn  = 'Luxury & Performance in One Place';
  const taglineTextAr = 'أبو موسى... لديكم لا خوف عليكم';
  const taglineTextEn = 'Abu Musa... With us, you have no fears';

  function getLang() {
    return document.documentElement.getAttribute('lang') || 'ar';
  }

  // ---- إعداد المرحلة الأولى: Badge ----
  let badgeOriginalContent = '';
  if (badgeSpan) {
    badgeOriginalContent = badgeSpan.textContent;
    badgeSpan.textContent = '';
    badgeSpan.removeAttribute('data-i18n');
  }

  // ---- إعداد المرحلة الثانية: Title ----
  let titleOriginalContent = '';
  if (titleEl) {
    titleOriginalContent = titleEl.textContent;
    titleEl.textContent = '';
    titleEl.removeAttribute('data-i18n');
    titleEl.style.minHeight = '4.5rem'; // احجز المساحة لمنع القفز
  }

  // ---- إعداد المرحلة الثالثة: Tagline ----
  taglineEl.removeAttribute('data-i18n');
  let textSpan   = taglineEl.querySelector('.tagline-text');
  let cursorSpan = taglineEl.querySelector('.tagline-cursor');
  if (!textSpan || !cursorSpan) {
    taglineEl.innerHTML = '';
    textSpan   = document.createElement('span');
    textSpan.className = 'tagline-text';
    cursorSpan = document.createElement('span');
    cursorSpan.className = 'tagline-cursor';
    cursorSpan.setAttribute('aria-hidden', 'true');
    taglineEl.appendChild(textSpan);
    taglineEl.appendChild(cursorSpan);
  }

  // ---- مساعد: كتابة نص في عنصر ----
  function typeText(targetEl, text, speedMin, speedMax, onDone) {
    let i = 0;
    function step() {
      if (i <= text.length) {
        targetEl.textContent = text.slice(0, i);
        i++;
        const delay = Math.floor(Math.random() * (speedMax - speedMin + 1)) + speedMin;
        setTimeout(step, delay);
      } else {
        if (onDone) onDone();
      }
    }
    step();
  }

  // ---- مساعد: محو نص من عنصر ----
  function deleteText(targetEl, speedMin, speedMax, onDone) {
    let text = targetEl.textContent;
    let i = text.length;
    function step() {
      if (i >= 0) {
        targetEl.textContent = text.slice(0, i);
        i--;
        const delay = Math.floor(Math.random() * (speedMax - speedMin + 1)) + speedMin;
        setTimeout(step, delay);
      } else {
        if (onDone) onDone();
      }
    }
    step();
  }

  // ---- المرحلة الثالثة: الكتابة والمحو المتكرر لنص أبو موسى ----
  function startTaglineLoop() {
    function loop() {
      const text = getLang() === 'en' ? taglineTextEn : taglineTextAr;
      typeText(textSpan, text, 90, 130, () => {
        // إضع توهج ذهبي عند اكتمال الكتابة
        textSpan.classList.add('glow-pulse');
        setTimeout(() => {
          textSpan.classList.remove('glow-pulse');
          // محو بعد توقف 2.5 ثانية
          deleteText(textSpan, 45, 65, () => {
            // توقف 700 مللي ثانية ثم إعادة الدورة
            setTimeout(loop, 700);
          });
        }, 2500);
      });
    }
    loop();
  }

  // ---- تشغيل المراحل بالتسلسل ----
  function runPhases() {
    const lang = getLang();

    // المرحلة 1: كتابة الـ badge
    if (badgeSpan) {
      const badgeText = lang === 'en' ? badgeTextEn : badgeTextAr;
      typeText(badgeSpan, badgeText, 30, 55, () => {
        // توقف قصير ثم المرحلة 2
        setTimeout(() => {

          // المرحلة 2: كتابة العنوان الرئيسي
          if (titleEl) {
            const titleText = lang === 'en' ? titleTextEn : titleTextAr;
            typeText(titleEl, titleText, 60, 95, () => {
              // توقف ثم المرحلة 3
              setTimeout(() => {
                startTaglineLoop();
              }, 400);
            });
          } else {
            setTimeout(() => startTaglineLoop(), 400);
          }

        }, 300);
      });
    } else {
      // لا يوجد badge — ابدأ مباشرة من العنوان
      if (titleEl) {
        const titleText = lang === 'en' ? titleTextEn : titleTextAr;
        typeText(titleEl, titleText, 60, 95, () => {
          setTimeout(() => startTaglineLoop(), 400);
        });
      } else {
        startTaglineLoop();
      }
    }
  }

  // ابدأ بعد 600ms لإتاحة تحميل الصفحة
  setTimeout(runPhases, 600);

  // مراقبة تغيير اللغة لإعادة ضبط النصوص
  const langObserver = new MutationObserver(() => {
    const lang = getLang();
    if (badgeSpan) badgeSpan.textContent = lang === 'en' ? badgeTextEn : badgeTextAr;
    if (titleEl)   titleEl.textContent   = lang === 'en' ? titleTextEn : titleTextAr;
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}

