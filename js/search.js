/* -------------------------------------------------------------------
   Aya Car Trading | معرض آية لتجارة السيارات
   Global Live Search Engine Module
------------------------------------------------------------------- */

const sampleCarsData = [
  { id: 1, nameAr: "مرسيدس بنز G-Class 63 AMG 2024", nameEn: "Mercedes-Benz G-Class 63 AMG 2024", brand: "mercedes", priceAr: "950,000 ر.س", priceEn: "950,000 SAR", year: 2024, type: "suv", image: "images/cars/g63.jpg", link: "cars.html" },
  { id: 2, nameAr: "رولز رويس كولينان 2024 Black Badge", nameEn: "Rolls-Royce Cullinan 2024 Black Badge", brand: "rolls-royce", priceAr: "2,400,000 ر.س", priceEn: "2,400,000 SAR", year: 2024, type: "luxury", image: "images/cars/cullinan.jpg", link: "cars.html" },
  { id: 3, nameAr: "بورش 911 GT3 RS 2024", nameEn: "Porsche 911 GT3 RS 2024", brand: "porsche", priceAr: "1,150,000 ر.س", priceEn: "1,150,000 SAR", year: 2024, type: "sports", image: "images/cars/gt3rs.jpg", link: "cars.html" },
  { id: 4, nameAr: "بي إم دبليو 760i xDrive 2024", nameEn: "BMW 760i xDrive 2024", brand: "bmw", priceAr: "680,000 ر.س", priceEn: "680,000 SAR", year: 2024, type: "sedan", image: "images/cars/bmw7.jpg", link: "cars.html" },
  { id: 5, nameAr: "أودي RS Q8 2024", nameEn: "Audi RS Q8 2024", brand: "audi", priceAr: "720,000 ر.س", priceEn: "720,000 SAR", year: 2024, type: "suv", image: "images/cars/rsq8.jpg", link: "cars.html" },
  { id: 6, nameAr: "رينج روفر SV Autobiography 2024", nameEn: "Range Rover SV Autobiography 2024", brand: "range-rover", priceAr: "1,280,000 ر.س", priceEn: "1,280,000 SAR", year: 2024, type: "suv", image: "images/cars/rangerover.jpg", link: "cars.html" }
];

document.addEventListener('DOMContentLoaded', () => {
  initSearchModal();
});

function initSearchModal() {
  let searchModal = document.getElementById('globalSearchModal');

  if (!searchModal) {
    searchModal = document.createElement('div');
    searchModal.id = 'globalSearchModal';
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
      <div class="search-modal-container">
        <span class="search-close-btn">&times;</span>
        <div class="search-input-box">
          <input type="text" id="globalSearchInput" data-i18n-placeholder="search_placeholder" placeholder="ابحث عن سيارة (مرسيدس، رولز رويس، بورش...)..." autocomplete="off">
        </div>
        <div class="search-results-box" id="globalSearchResults"></div>
      </div>
    `;
    document.body.appendChild(searchModal);
  }

  const searchInput = document.getElementById('globalSearchInput');
  const resultsBox = document.getElementById('globalSearchResults');
  const closeBtn = searchModal.querySelector('.search-close-btn');

  const openSearch = () => {
    searchModal.classList.add('open');
    setTimeout(() => searchInput.focus(), 100);
  };

  const closeSearch = () => {
    searchModal.classList.remove('open');
    searchInput.value = '';
    resultsBox.innerHTML = '';
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.search-trigger-btn')) {
      openSearch();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });

  // Dynamic Live Search Logic
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      resultsBox.innerHTML = '';

      if (query.length < 2) return;

      const lang = document.documentElement.getAttribute('lang') || 'ar';
      const filtered = sampleCarsData.filter(car => 
        car.nameAr.toLowerCase().includes(query) || car.nameEn.toLowerCase().includes(query) || car.brand.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        const noResultsMsg = lang === 'en' ? `No matching results found for "${query}"` : `لم يتم العثور على نتائج مطابقة لـ "${query}"`;
        resultsBox.innerHTML = `
          <div style="padding: 20px; text-align: center; color: var(--text-secondary);">
            ${noResultsMsg}
          </div>
        `;
        return;
      }

      filtered.forEach(car => {
        const name = lang === 'en' ? car.nameEn : car.nameAr;
        const price = lang === 'en' ? car.priceEn : car.priceAr;
        const chevronClass = lang === 'en' ? 'fas fa-chevron-right gold-text' : 'fas fa-chevron-left gold-text';

        const item = document.createElement('a');
        item.href = car.link;
        item.className = 'search-result-item';
        item.innerHTML = `
          <div style="width: 50px; height: 50px; border-radius: 8px; background: var(--color-gold-subtle); display: flex; align-items: center; justify-content: center; color: var(--color-gold);">
            <i class="fas fa-car"></i>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: var(--text-primary);">${name}</div>
            <div style="font-size: 0.85rem; color: var(--color-gold);">${price}</div>
          </div>
          <i class="${chevronClass}"></i>
        `;
        resultsBox.appendChild(item);
      });
    });
  }
}

