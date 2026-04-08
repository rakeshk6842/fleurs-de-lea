(() => {
  const STORAGE_KEY = 'fleursAdminContent';

  const defaults = {
    site: {
      phoneDisplay: '703-828-5518',
      phoneHref: 'tel:+17038285518',
      email: 'fleursdelea@gmail.com',
      homeTopbar: 'Offering same-day delivery from Historic Fairfax City across the Northern Virginia DMV',
      weddingTopbar: 'Wedding floral design for Fairfax, Alexandria, Arlington & Falls Church',
      aboutTopbar: 'Thoughtful floral design rooted in Fairfax, VA',
      contactTopbar: 'Quick inquiries for bouquets, weddings, and classes'
    },
    home: {
      heroTitle: 'Artful Floral Design In Historic Fairfax City | Fairfax Florist',
      heroLead:
        'Experience the perfect blend of artistry and tradition in Historic Fairfax City. Stunning arrangements, thoughtful service, and flowers that turn everyday moments into something unforgettable.',
      primaryCtaLabel: 'Contact us',
      primaryCtaHref: 'contact.html#booking-form',
      secondaryCtaLabel: 'See pricing',
      secondaryCtaHref: '#pricing-section',
      heroImage: 'assets/images/home-hero.webp'
    },
    weddings: {
      heroTitle: 'Wedding flowers your guests will talk about long after the last dance.',
      heroLead:
        'From bridal bouquets to full reception styling, Fleurs-de-Lea creates romantic, story-driven wedding florals that feel elevated, personal, and beautifully effortless.',
      primaryCtaLabel: 'Call the studio',
      primaryCtaHref: 'tel:+17038285518',
      secondaryCtaLabel: 'Book a free consultation',
      secondaryCtaHref: 'contact.html#booking-form',
      heroImage: 'assets/images/wedding-hero.webp'
    },
    about: {
      heroTitle: 'Fleurs-de-Lea began with a simple belief: flowers should feel personal.',
      heroLead:
        'Over the past three years, the Fairfax studio has grown around thoughtful design, genuine care, and flowers that tell each client’s story.',
      image: 'assets/images/about-hero.webp'
    },
    contact: {
      heroTitle: 'Request a custom arrangement without the back-and-forth.',
      heroLead:
        'Tell the studio what you need, your budget, your preferred date, and your delivery city in one place.',
      image: 'assets/images/contact-hero.webp'
    }
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const deepMerge = (base, override) => {
    if (!override || typeof override !== 'object' || Array.isArray(override)) {
      return override ?? base;
    }

    const output = Array.isArray(base) ? [...base] : { ...base };

    Object.keys(override).forEach((key) => {
      const baseValue = output[key];
      const overrideValue = override[key];

      if (
        baseValue &&
        typeof baseValue === 'object' &&
        !Array.isArray(baseValue) &&
        overrideValue &&
        typeof overrideValue === 'object' &&
        !Array.isArray(overrideValue)
      ) {
        output[key] = deepMerge(baseValue, overrideValue);
      } else {
        output[key] = overrideValue;
      }
    });

    return output;
  };

  const getValueByPath = (source, path) =>
    path.split('.').reduce((current, key) => (current && current[key] !== undefined ? current[key] : undefined), source);

  const setValueByPath = (source, path, value) => {
    const keys = path.split('.');
    let current = source;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] = current[key] && typeof current[key] === 'object' ? current[key] : {};
        current = current[key];
      }
    });
  };

  const getStoredContent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaults);
      return deepMerge(clone(defaults), JSON.parse(raw));
    } catch {
      return clone(defaults);
    }
  };

  const saveContent = (content) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  };

  const resetContent = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const applyContent = () => {
    const content = getStoredContent();

    document.querySelectorAll('[data-editable]').forEach((element) => {
      const value = getValueByPath(content, element.dataset.editable);
      if (typeof value === 'string') {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-editable-link]').forEach((element) => {
      const value = getValueByPath(content, element.dataset.editableLink);
      if (typeof value === 'string' && value.trim()) {
        element.setAttribute('href', value);
      }
    });

    document.querySelectorAll('[data-editable-image]').forEach((element) => {
      const value = getValueByPath(content, element.dataset.editableImage);
      if (typeof value === 'string' && value.trim()) {
        element.setAttribute('src', value);
      }
    });

    document.querySelectorAll('[data-phone-link]').forEach((element) => {
      element.setAttribute('href', content.site.phoneHref);
    });

    document.querySelectorAll('[data-phone-text]').forEach((element) => {
      const prefix = element.dataset.phoneText || '';
      element.textContent = `${prefix}${content.site.phoneDisplay}`;
    });

    document.querySelectorAll('[data-email-link]').forEach((element) => {
      element.setAttribute('href', `mailto:${content.site.email}`);
    });

    document.querySelectorAll('[data-email-text]').forEach((element) => {
      element.textContent = content.site.email;
    });
  };

  document.addEventListener('DOMContentLoaded', applyContent);

  window.FleursContent = {
    STORAGE_KEY,
    defaults,
    getStoredContent,
    saveContent,
    resetContent,
    setValueByPath,
    getValueByPath,
    applyContent
  };
})();
