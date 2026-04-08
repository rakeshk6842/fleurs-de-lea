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

  const siteHeader = document.querySelector('.site-header');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');
  const mobileNav = window.matchMedia('(max-width: 900px)');

  if (siteHeader && navbar && navLinks && !navbar.querySelector('.nav-toggle')) {
    const navToggle = document.createElement('button');
    navToggle.type = 'button';
    navToggle.className = 'nav-toggle';
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    navToggle.innerHTML = '<span class="nav-toggle-icon" aria-hidden="true">☰</span><span>Menu</span>';
    navbar.insertBefore(navToggle, navLinks);

    const setNavState = (isOpen) => {
      siteHeader.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      navToggle.innerHTML = isOpen
        ? '<span class="nav-toggle-icon" aria-hidden="true">✕</span><span>Close</span>'
        : '<span class="nav-toggle-icon" aria-hidden="true">☰</span><span>Menu</span>';

      if (!isOpen) {
        document.querySelectorAll('.nav-dropdown.open').forEach((dropdown) => {
          dropdown.classList.remove('open');
        });
      }
    };

    navToggle.addEventListener('click', () => {
      setNavState(!siteHeader.classList.contains('nav-open'));
    });

    navLinks.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
      const toggleLink = dropdown.querySelector('.dropdown-toggle');
      if (!toggleLink) return;

      toggleLink.addEventListener('click', (event) => {
        if (!mobileNav.matches) return;
        event.preventDefault();
        dropdown.classList.toggle('open');
      });
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      if (link.classList.contains('dropdown-toggle')) return;
      link.addEventListener('click', () => {
        if (mobileNav.matches) setNavState(false);
      });
    });

    const handleViewportChange = (event) => {
      if (!event.matches) {
        setNavState(false);
      }
    };

    if (typeof mobileNav.addEventListener === 'function') {
      mobileNav.addEventListener('change', handleViewportChange);
    } else if (typeof mobileNav.addListener === 'function') {
      mobileNav.addListener(handleViewportChange);
    }
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
