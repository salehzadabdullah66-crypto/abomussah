/* -------------------------------------------------------------------
   Aya Car Trading | معرض آية لتجارة السيارات
   Car Inventory Filtering & Sorting Engine
------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initCarFilters();
  initFavoriteButtons();
  initCompareButtons();
});

function initCarFilters() {
  const brandSelect = document.getElementById('filterBrand');
  const typeSelect = document.getElementById('filterType');
  const fuelSelect = document.getElementById('filterFuel');
  const priceRange = document.getElementById('filterPrice');
  const priceVal = document.getElementById('filterPriceVal');
  const carCards = document.querySelectorAll('.car-card-item');

  if (carCards.length === 0) return;

  const runFilter = () => {
    const brandVal = brandSelect ? brandSelect.value : 'all';
    const typeVal = typeSelect ? typeSelect.value : 'all';
    const fuelVal = fuelSelect ? fuelSelect.value : 'all';
    const maxPrice = priceRange ? parseInt(priceRange.value, 10) : 5000000;

    if (priceVal && priceRange) {
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      priceVal.textContent = new Intl.NumberFormat().format(priceRange.value) + (lang === 'en' ? ' SAR' : ' ر.س');
    }

    carCards.forEach(card => {
      const cardBrand = card.getAttribute('data-brand') || 'all';
      const cardType = card.getAttribute('data-type') || 'all';
      const cardFuel = card.getAttribute('data-fuel') || 'all';
      const cardPrice = parseInt(card.getAttribute('data-price') || '0', 10);

      const matchBrand = brandVal === 'all' || cardBrand === brandVal;
      const matchType = typeVal === 'all' || cardType === typeVal;
      const matchFuel = fuelVal === 'all' || cardFuel === fuelVal;
      const matchPrice = cardPrice <= maxPrice;

      if (matchBrand && matchType && matchFuel && matchPrice) {
        card.style.display = 'flex';
        setTimeout(() => card.style.opacity = '1', 50);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  };

  [brandSelect, typeSelect, fuelSelect, priceRange].forEach(input => {
    if (input) {
      input.addEventListener('change', runFilter);
      input.addEventListener('input', runFilter);
    }
  });

  window.addEventListener('aya_language_changed', runFilter);
}

function initFavoriteButtons() {
  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.favorite-btn');
    if (favBtn) {
      e.preventDefault();
      favBtn.classList.toggle('active');
      const isFav = favBtn.classList.contains('active');
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      if (window.showToast) {
        const msg = isFav 
          ? (lang === 'en' ? 'Car added to favorites' : 'تم إضافة السيارة للمفضلة')
          : (lang === 'en' ? 'Car removed from favorites' : 'تم إزالة السيارة من المفضلة');
        window.showToast(msg, isFav ? 'gold' : 'muted');
      }
    }
  });
}

function initCompareButtons() {
  document.addEventListener('click', (e) => {
    const compareBtn = e.target.closest('.btn-compare');
    if (compareBtn) {
      e.preventDefault();
      const lang = document.documentElement.getAttribute('lang') || 'ar';
      if (window.showToast) {
        window.showToast(lang === 'en' ? 'Car comparison feature coming soon!' : 'ميزة مقارنة السيارات ستكون متاحة قريباً!', 'gold');
      }
    }
  });
}

