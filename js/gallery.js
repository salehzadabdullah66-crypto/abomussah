/* -------------------------------------------------------------------
   Aya Car Trading | معرض آية لتجارة السيارات
   Gallery Logic & Lightbox Popup Engine
------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/* Filter Gallery Items */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* Lightbox Modal (Supports Images & Luxury Video Player) */
function initLightbox() {
  let lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'galleryLightbox';
    lightbox.className = 'search-modal';
    lightbox.innerHTML = `
      <div class="search-modal-container" id="lightboxInnerBox" style="max-width: 920px; width: 95%; text-align: center; position: relative; padding: 20px 20px 25px;">
        <button class="lightbox-close" id="lightboxCloseBtn" aria-label="إغلاق" style="
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-gold);
          color: #000;
          border: none;
          font-size: 1.5rem;
          font-weight: 900;
          cursor: pointer;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(212,175,55,0.6);
          line-height: 1;
        ">&times;</button>
        <div id="lightboxMediaContainer" style="width: 100%; display: flex; justify-content: center; align-items: center; min-height: 250px;"></div>
        <p id="lightboxCaption" style="margin-top: 14px; color: var(--color-gold); font-weight: 700; font-size: 1.05rem;"></p>
        <p style="margin-top: 8px; color: var(--text-secondary); font-size: 0.8rem;">اضغط على زر ✕ لإغلاق الفيديو</p>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const mediaContainer = document.getElementById('lightboxMediaContainer');
  const lightboxCaption   = document.getElementById('lightboxCaption');
  const lightboxInnerBox  = document.getElementById('lightboxInnerBox');
  const closeBtn          = document.getElementById('lightboxCloseBtn');

  /* ---- فتح الـ Lightbox ---- */
  document.addEventListener('click', (e) => {
    const galleryCard = e.target.closest('.gallery-zoom-trigger');
    if (!galleryCard) return;

    const videoSrc = galleryCard.getAttribute('data-video');
    const imgSrc   = galleryCard.getAttribute('data-src') || galleryCard.querySelector('img')?.src;
    const lang     = document.documentElement.getAttribute('lang') || 'ar';
    const caption  = (lang === 'en'
      ? galleryCard.getAttribute('data-caption-en')
      : galleryCard.getAttribute('data-caption'))
      || galleryCard.getAttribute('data-caption')
      || galleryCard.querySelector('img')?.alt || '';

    mediaContainer.innerHTML = '';

    if (videoSrc) {
      if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be') || videoSrc.includes('vimeo.com')) {
        let embedUrl = videoSrc;
        if (videoSrc.includes('youtube.com/watch?v=')) {
          embedUrl = videoSrc.replace('watch?v=', 'embed/') + '?autoplay=1&rel=0';
        } else if (videoSrc.includes('youtu.be/')) {
          embedUrl = 'https://www.youtube.com/embed/' + videoSrc.split('youtu.be/')[1] + '?autoplay=1&rel=0';
        }
        mediaContainer.innerHTML = `
          <div style="position:relative;width:100%;padding-top:56.25%;border-radius:14px;overflow:hidden;border:2px solid var(--color-gold);box-shadow:0 0 40px rgba(212,175,55,0.4);">
            <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay;encrypted-media" allowfullscreen></iframe>
          </div>`;
      } else {
        // ملف فيديو مباشر mp4/webm
        const fallbackText = lang === 'en' ? 'Your browser does not support video.' : 'متصفحك لا يدعم تشغيل الفيديو.';
        mediaContainer.innerHTML = `
          <video
            id="lightboxVideo"
            controls
            autoplay
            playsinline
            preload="auto"
            style="width:100%;max-height:72vh;border-radius:14px;border:2px solid var(--color-gold);box-shadow:0 0 40px rgba(212,175,55,0.4);outline:none;display:block;">
            <source src="${videoSrc}" type="video/mp4">
            <source src="${videoSrc.replace('.mp4','.webm')}" type="video/webm">
            ${fallbackText}
          </video>`;

        // تشغيل الفيديو بعد إدراجه في DOM
        const vid = document.getElementById('lightboxVideo');
        if (vid) {
          vid.load();
          vid.play().catch(() => {});
        }
      }
    } else if (imgSrc) {
      mediaContainer.innerHTML = `
        <img src="${imgSrc}" alt="${caption}"
          style="max-height:80vh;max-width:100%;border-radius:14px;border:2px solid var(--color-gold);box-shadow:0 0 40px rgba(212,175,55,0.4);object-fit:contain;">`;
    }

    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // منع التمرير خلف النافذة
  });

  /* ---- إغلاق الـ Lightbox ---- */
  const closeLightbox = () => {
    // إيقاف الفيديو بشكل صحيح قبل الإزالة لمنع التوقف المفاجئ
    const vid = document.getElementById('lightboxVideo');
    if (vid) {
      vid.pause();
      vid.currentTime = 0;
      vid.src = '';
      vid.load();
    }
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (mediaContainer) mediaContainer.innerHTML = '';
    }, 350);
  };

  // زر الإغلاق
  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // إغلاق بالضغط على الخلفية الداكنة فقط (ليس على الصندوق الداخلي)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // منع إغلاق الـ Lightbox عند الضغط داخل الصندوق
  if (lightboxInnerBox) {
    lightboxInnerBox.addEventListener('click', (e) => e.stopPropagation());
  }

  // إغلاق بزر Escape من لوحة المفاتيح
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}
