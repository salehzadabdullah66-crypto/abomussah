/* -------------------------------------------------------------------
   Aya Car Trading | معرض آية لتجارة السيارات
   Hero & Testimonials Carousel Slider Engine
------------------------------------------------------------------- */

class CarouselSlider {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) return;

    this.track = this.container.querySelector('.slider-track');
    this.slides = Array.from(this.container.querySelectorAll('.slide'));
    this.nextBtn = this.container.querySelector('.slider-next');
    this.prevBtn = this.container.querySelector('.slider-prev');
    this.dotsContainer = this.container.querySelector('.slider-dots');

    this.currentIndex = 0;
    this.autoplayInterval = options.autoplay || 5000;
    this.timer = null;

    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    this.renderDots();
    this.updateSlides();

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }

    this.startAutoplay();

    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === this.currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${idx + 1}`);
      dot.addEventListener('click', () => this.goTo(idx));
      this.dotsContainer.appendChild(dot);
    });
  }

  updateSlides() {
    if (this.track) {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      const dirMult = isRtl ? 1 : -1;
      this.track.style.transform = `translateX(${dirMult * (this.currentIndex * 100)}%)`;
    }

    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    if (this.dotsContainer) {
      const dots = Array.from(this.dotsContainer.children);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlides();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
  }

  goTo(index) {
    this.currentIndex = index;
    this.updateSlides();
  }

  startAutoplay() {
    if (this.autoplayInterval && !this.timer) {
      this.timer = setInterval(() => this.next(), this.autoplayInterval);
    }
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    new CarouselSlider(heroSlider, { autoplay: 6000 });
  }

  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    new CarouselSlider(testimonialSlider, { autoplay: 7000 });
  }
});
