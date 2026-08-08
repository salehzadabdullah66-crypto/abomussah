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
    lightbox.className = 'search-modal'; // reuse glass modal style
    lightbox.innerHTML = `
      <div class="search-modal-container" style="max-width: 900px; width: 92%; text-align: center; position: relative; padding: 25px;">
        <span class="lightbox-close search-close-btn" style="z-index: 10;">&times;</span>
        <div id="lightboxMediaContainer" style="width: 100%; display: flex; justify-content: center; align-items: center; min-height: 250px;"></div>
        <p id="lightboxCaption" style="margin-top: 15px; color: var(--color-gold); font-weight: 700; font-size: 1.2rem;"></p>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const mediaContainer = document.getElementById('lightboxMediaContainer');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  document.addEventListener('click', (e) => {
    const galleryCard = e.target.closest('.gallery-zoom-trigger');
    if (galleryCard) {
      const videoSrc = galleryCard.getAttribute('data-video');
      const imgSrc = galleryCard.getAttribute('data-src') || galleryCard.querySelector('img')?.src;
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      const caption = (lang === 'en' ? galleryCard.getAttribute('data-caption-en') : galleryCard.getAttribute('data-caption')) || galleryCard.getAttribute('data-caption') || galleryCard.querySelector('img')?.alt || '';

      mediaContainer.innerHTML = '';

      if (videoSrc) {
        // Check if YouTube / Vimeo or Direct Video file (.mp4, .webm, etc.)
        if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be') || videoSrc.includes('vimeo.com')) {
          let embedUrl = videoSrc;
          if (videoSrc.includes('youtube.com/watch?v=')) {
            embedUrl = videoSrc.replace('watch?v=', 'embed/') + '?autoplay=1';
          } else if (videoSrc.includes('youtu.be/')) {
            embedUrl = videoSrc.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1';
          }
          mediaContainer.innerHTML = `
            <div style="position: relative; width: 100%; padding-top: 56.25%; border-radius: 16px; overflow: hidden; border: 2px solid var(--color-gold); box-shadow: 0 0 40px rgba(212, 175, 55, 0.4);">
              <iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
          `;
        } else {
          // Direct HTML5 Video File (e.g. videos/testimonial.mp4)
          const fallbackText = lang === 'en' ? 'Your browser does not support video playback.' : 'متصفحك لا يدعم تشغيل الفيديو.';
          mediaContainer.innerHTML = `
            <video controls autoplay style="width: 100%; max-height: 75vh; border-radius: 16px; border: 2px solid var(--color-gold); box-shadow: 0 0 40px rgba(212, 175, 55, 0.4); outline: none;">
              <source src="${videoSrc}" type="video/mp4">
              ${fallbackText}
            </video>
          `;
        }
      } else if (imgSrc) {
        mediaContainer.innerHTML = `
          <img src="${imgSrc}" alt="${caption}" style="max-height: 80vh; max-width: 100%; border-radius: 16px; border: 2px solid var(--color-gold); box-shadow: 0 0 40px rgba(212, 175, 55, 0.4); object-fit: contain;">
        `;
      }

      lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
    }
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    // Stop video playback on close
    setTimeout(() => {
      if (mediaContainer) mediaContainer.innerHTML = '';
    }, 300);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
