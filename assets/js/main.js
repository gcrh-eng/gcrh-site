(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();

  // Language suggestion: it does not redirect automatically.
  const notice = document.querySelector('[data-language-notice]');
  const dismiss = document.querySelector('[data-dismiss-language]');
  if (notice && !localStorage.getItem('gcrh-lang-notice-dismissed')) {
    const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const isPortuguesePage = document.documentElement.lang.toLowerCase().startsWith('pt');
    if (isPortuguesePage && lang.startsWith('en')) {
      notice.style.display = 'block';
    }
  }
  if (dismiss && notice) {
    dismiss.addEventListener('click', () => {
      localStorage.setItem('gcrh-lang-notice-dismissed', '1');
      notice.style.display = 'none';
    });
  }

  const dropdownTriggers = document.querySelectorAll('[data-dropdown-trigger]');

  dropdownTriggers.forEach((trigger) => {
    const parent = trigger.closest('.has-dropdown');

    trigger.addEventListener('click', (event) => {
      const isMobile = window.matchMedia('(max-width: 860px)').matches;

      if (isMobile && parent) {
        event.preventDefault();
        const isOpen = parent.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      }
    });
  });

  document.addEventListener('click', (event) => {
    const openDropdowns = document.querySelectorAll('.has-dropdown.is-open');

    openDropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('is-open');
        const trigger = dropdown.querySelector('[data-dropdown-trigger]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Simple client-side filter used on model listing pages.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems.forEach((item) => {
        const cat = item.getAttribute('data-category');
        item.style.display = (filter === 'todos' || cat === filter) ? '' : 'none';
      });
    });
  });

  const lightbox = document.querySelector('[data-lightbox]');

  if (lightbox) {
    const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
    const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]');
    const lightboxClose = lightbox.querySelector('[data-lightbox-close]');
    const lightboxDialog = lightbox.querySelector('.lightbox-dialog');

    if (lightboxImage && lightboxCaption && lightboxClose) {
      const openLightbox = (trigger) => {
        const imageSrc = trigger.getAttribute('data-lightbox-src');
        const caption = trigger.getAttribute('data-lightbox-caption') || '';
        const imageAlt = trigger.querySelector('img')?.getAttribute('alt') || caption || 'Imagem ampliada';

        if (!imageSrc) return;

        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightboxCaption.textContent = caption;

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      };

      const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxCaption.textContent = '';
        document.body.style.overflow = '';
      };

      

      document.addEventListener('click', (event) => {
        const closeButton = event.target.closest('[data-lightbox-close]');

        if (closeButton) {
          event.preventDefault();
          closeLightbox();
          return;
        }

        if (event.target === lightbox) {
          closeLightbox();
          return;
        }

        const trigger = event.target.closest('[data-lightbox-src]');

        if (trigger) {
          event.preventDefault();
          openLightbox(trigger);
          return;
        }
      });

      if (lightboxDialog) {
        lightboxDialog.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      }

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
          closeLightbox();
        }
      });
    }
  }

  function loadTallyEmbeds() {
  const tallyScriptUrl = "https://tally.so/widgets/embed.js";

  const loadEmbeds = function () {
    if (typeof Tally !== "undefined") {
      Tally.loadEmbeds();
    } else {
      document
        .querySelectorAll("iframe[data-tally-src]:not([src])")
        .forEach(function (iframe) {
          iframe.src = iframe.dataset.tallySrc;
        });
    }
  };

  if (typeof Tally !== "undefined") {
    loadEmbeds();
    return;
  }

  if (document.querySelector(`script[src="${tallyScriptUrl}"]`) === null) {
    const script = document.createElement("script");
    script.src = tallyScriptUrl;
    script.onload = loadEmbeds;
    script.onerror = loadEmbeds;
    document.body.appendChild(script);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadTallyEmbeds();
});

})();
