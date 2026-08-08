/* -------------------------------------------------------------------
   Aya Car Trading | معرض آية لتجارة السيارات
   Main Script - App Initialization, Utilities & Micro-interactions
------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initBackToTop();
  initCustomCursor();
  initToastContainer();
  initFieryAudioPlayer();
  initShowcaseVideoPlayer();
});

/* Hide Preloader */
function initPreloader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 800);
    }, 400);
  }
}

/* Reading Scroll Progress Bar */
function initScrollProgress() {
  let progress = document.querySelector('.scroll-progress-bar');
  if (!progress) {
    progress = document.createElement('div');
    progress.className = 'scroll-progress-bar';
    document.body.appendChild(progress);
  }

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progressWidth = (scrollPosition / totalHeight) * 100;
    progress.style.width = `${progressWidth}%`;
  }, { passive: true });
}

/* Back to Top Button */
function initBackToTop() {
  let backBtn = document.querySelector('.back-to-top');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('active');
    } else {
      backBtn.classList.remove('active');
    }
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Custom Cursor Effect */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let cursor = document.querySelector('.custom-cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  }

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, select, .car-card, .service-card, .btn')) {
      cursor.classList.add('cursor-hover');
    } else {
      cursor.classList.remove('cursor-hover');
    }
  });
}

/* Toast Container Helper */
function initToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function(message, type = 'gold') {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-info-circle gold-text"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

/* Fiery Audio Player Engine */
function initFieryAudioPlayer() {
  document.addEventListener('click', (e) => {
    const playBtn = e.target.closest('.fiery-play-btn');
    if (!playBtn) return;

    const card = playBtn.closest('.fiery-audio-card');
    if (!card) return;

    const audio = card.querySelector('.fiery-audio-element');
    const timeEl = card.querySelector('.fiery-audio-time');
    const icon = playBtn.querySelector('i');
    if (!audio) return;

    // Pause all other playing fiery audio cards first
    document.querySelectorAll('.fiery-audio-element').forEach(otherAudio => {
      if (otherAudio !== audio && !otherAudio.paused) {
        otherAudio.pause();
        const otherCard = otherAudio.closest('.fiery-audio-card');
        if (otherCard) {
          otherCard.classList.remove('playing');
          const otherIcon = otherCard.querySelector('.fiery-play-btn i');
          if (otherIcon) otherIcon.className = 'fas fa-play';
        }
      }
    });

    const formatTime = (secs) => {
      if (isNaN(secs) || !isFinite(secs)) return '0:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (audio.paused) {
      audio.play().then(() => {
        card.classList.add('playing');
        if (icon) icon.className = 'fas fa-pause';
      }).catch(err => console.error("Audio playback error:", err));
    } else {
      audio.pause();
      card.classList.remove('playing');
      if (icon) icon.className = 'fas fa-play';
    }

    if (!audio._hasEvents) {
      audio._hasEvents = true;
      audio.addEventListener('timeupdate', () => {
        if (timeEl) timeEl.textContent = formatTime(audio.currentTime);
      });
      audio.addEventListener('ended', () => {
        card.classList.remove('playing');
        if (icon) icon.className = 'fas fa-play';
        if (timeEl) timeEl.textContent = formatTime(audio.duration || 0);
      });
      audio.addEventListener('loadedmetadata', () => {
        if (timeEl && audio.currentTime === 0) timeEl.textContent = formatTime(audio.duration || 0);
      });
    }
  });
}

/* Showcase Video Player Engine */
function initShowcaseVideoPlayer() {
  const container = document.querySelector('.fullscreen-video-card');
  if (!container) return;

  const video = container.querySelector('#mainShowcaseVideo');
  const soundToggleBtn = container.querySelector('#videoSoundToggle');
  const overlay = container.querySelector('#videoOverlay');

  if (!video) return;

  let hasUnlockedAudio = false;
  let userManuallyMuted = false;

  // Function to sync button icon with video mute state
  const updateSoundUI = () => {
    if (!soundToggleBtn) return;
    const icon = soundToggleBtn.querySelector('i');
    if (!icon) return;

    if (video.muted) {
      icon.className = 'fas fa-volume-mute';
      soundToggleBtn.classList.add('muted');
      soundToggleBtn.setAttribute('aria-label', 'تشغيل الصوت');
    } else {
      icon.className = 'fas fa-volume-up';
      soundToggleBtn.classList.remove('muted');
      soundToggleBtn.setAttribute('aria-label', 'إيقاف الصوت');
    }
  };

  // Sound Mute/Unmute Button Handler
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      video.muted = !video.muted;
      userManuallyMuted = video.muted;
      if (!video.muted) video.volume = 1.0;
      updateSoundUI();
    });
  }

  // Toggle Play / Pause on Video Click
  video.addEventListener('click', (e) => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  // Sync UI on native volume/mute control events
  video.addEventListener('volumechange', updateSoundUI);

  // Global initial gesture listener ONLY to unlock audio for browser policy ONCE
  const unlockAudioOnFirstGesture = () => {
    if (hasUnlockedAudio) return;
    hasUnlockedAudio = true;

    // Remove one-time gesture listeners
    interactionEvents.forEach(evt => {
      window.removeEventListener(evt, unlockAudioOnFirstGesture, { capture: true });
    });

    // Unmute on first interaction ONLY if user hasn't explicitly muted
    if (!userManuallyMuted) {
      video.muted = false;
      video.volume = 1.0;
      updateSoundUI();
    }
  };

  const interactionEvents = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
  interactionEvents.forEach(evt => {
    window.addEventListener(evt, unlockAudioOnFirstGesture, { passive: true, capture: true });
  });

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.classList.add('hidden');
      if (video.paused) {
        video.play().catch(() => {});
      }
    });
  }

  // Initial autoplay on page load
  updateSoundUI();
  video.play().catch(() => {
    video.muted = true;
    updateSoundUI();
    video.play().catch(() => {});
  });
}

