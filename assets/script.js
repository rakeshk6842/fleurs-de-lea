document.addEventListener('DOMContentLoaded', () => {
  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  const storedContent = window.FleursContent?.getStoredContent?.();
  const phoneDisplay = storedContent?.site?.phoneDisplay || '703-828-5518';
  const phoneHref = storedContent?.site?.phoneHref || 'tel:+17038285518';

  if (!document.querySelector('.floating-call')) {
    const floatingCall = document.createElement('a');
    floatingCall.href = phoneHref;
    floatingCall.className = 'floating-call';
    floatingCall.setAttribute('aria-label', 'Call Fleurs-de-Lea now');
    floatingCall.innerHTML = `<span>Call the studio</span><strong>${phoneDisplay}</strong>`;
    document.body.appendChild(floatingCall);
  }

  document.querySelectorAll('.lead-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const success = form.querySelector('.success-message');
      if (success) {
        success.style.display = 'block';
        success.textContent = 'Thanks — your request has been captured in this site demo. Connect this form to Formspree, Netlify Forms, or your CRM to receive submissions live.';
      }
      form.reset();
    });
  });
});
