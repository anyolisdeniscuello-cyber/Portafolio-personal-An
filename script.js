(() => {
  const themeButton = document.getElementById('themeToggle');
  const themeIcon = themeButton?.querySelector('i');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  function readSavedTheme() {
    try { return window.localStorage.getItem('portfolio-theme'); } catch { return null; }
  }
  function saveTheme(theme) {
    try { window.localStorage.setItem('portfolio-theme', theme); } catch { /* sin almacenamiento */ }
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    if (themeIcon) {
      themeIcon.classList.toggle('fa-moon', !isDark);
      themeIcon.classList.toggle('fa-sun', isDark);
    }
    if (themeButton) {
      themeButton.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
      themeButton.title = isDark ? 'Activar modo claro' : 'Activar modo oscuro';
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#1e1517' : '#fff7f1');
  }

  const initialTheme = readSavedTheme();
  applyTheme(initialTheme === 'light' || initialTheme === 'dark'
    ? initialTheme
    : (systemTheme.matches ? 'dark' : 'light'));

  themeButton?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });

  systemTheme.addEventListener?.('change', (event) => {
    if (!readSavedTheme()) applyTheme(event.matches ? 'dark' : 'light');
  });

  // Cierra el menú en celular al tocar un enlace
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navPortfolio');
      if (menu?.classList.contains('show') && window.bootstrap?.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Resalta en el menú la sección que estás viendo
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((section) => spy.observe(section));

  // Año automático del pie de página
  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  // Formulario de contacto (demostración)
  const contactForm = document.getElementById('contactForm');
  const formNotice = document.getElementById('formNotice');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    const nombre = document.getElementById('contactName').value.trim();
    if (formNotice) {
      formNotice.hidden = false;
      // CAMBIA AQUÍ EL MENSAJE DE ÉXITO SI QUIERES
      formNotice.textContent = `¡Gracias, ${nombre}! Tu mensaje fue enviado correctamente.`;
    }
    contactForm.reset();
    setTimeout(() => { if (formNotice) formNotice.hidden = true; }, 6000);
  });
})();