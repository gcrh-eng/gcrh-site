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
})();
