/* -------------------------------------------------------------------
   Aya Car Trading | معرض آية لتجارة السيارات
   Forms Validation & Financing Calculator Logic
------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFinancingCalculator();
});

function initContactForm() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff4d4d';
        } else {
          input.style.borderColor = '';
        }
      });

      const lang = document.documentElement.getAttribute('lang') || 'ar';

      if (!isValid) {
        if (window.showToast) {
          window.showToast(lang === 'en' ? 'Please fill in all required fields correctly' : 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'warning');
        }
        return;
      }

      // Successful Submission
      if (window.showToast) {
        window.showToast(lang === 'en' ? 'Your request has been sent successfully! Aya team will contact you soon.' : 'تم إرسال طلبك بنجاح! سيتواصل معك فريق معرض آية قريباً.', 'gold');
      }

      form.reset();
    });
  });
}

function initFinancingCalculator() {
  const priceInput = document.getElementById('calcCarPrice');
  const downPaymentInput = document.getElementById('calcDownPayment');
  const periodSelect = document.getElementById('calcPeriod');
  const resultElement = document.getElementById('calcMonthlyResult');

  if (!priceInput || !downPaymentInput || !periodSelect || !resultElement) return;

  const calculateInstallment = () => {
    const price = parseFloat(priceInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const months = parseInt(periodSelect.value, 10) || 36;
    const annualInterest = 0.045; // 4.5% annual profit rate
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    const currency = lang === 'en' ? ' SAR' : ' ر.س';

    const loanAmount = Math.max(0, price - downPayment);
    if (loanAmount === 0 || months === 0) {
      resultElement.textContent = '0' + currency;
      return;
    }

    const totalInterest = loanAmount * (annualInterest * (months / 12));
    const totalLoan = loanAmount + totalInterest;
    const monthlyPayment = Math.round(totalLoan / months);

    resultElement.textContent = new Intl.NumberFormat().format(monthlyPayment) + currency;
  };

  [priceInput, downPaymentInput, periodSelect].forEach(element => {
    element.addEventListener('input', calculateInstallment);
    element.addEventListener('change', calculateInstallment);
  });

  window.addEventListener('aya_language_changed', calculateInstallment);

  calculateInstallment();
}

