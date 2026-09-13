/* =========================================================
   Portafolio — comportamiento
   1. Tema claro/oscuro con persistencia (localStorage)
   2. Menú responsive (mobile nav)
   3. Botón volver al inicio
   4. Filtro de proyectos por tecnología (solo proyectos.html)
   5. Validación de formulario de contacto (solo contacto.html)
   ========================================================= */

(function themeToggle() {
  const root = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const setIcon = (theme) => {
      btn.setAttribute('aria-pressed', theme === 'dark');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    };
    setIcon(initial);
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
      setIcon(next);
    });
  });
})();

(function mobileNav() {
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const header = document.querySelector('.site-header');
    if (!toggle || !header) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      header.classList.toggle('menu-open', !expanded);
    });

    header.querySelectorAll('.nav-list a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        header.classList.remove('menu-open');
      });
    });
  });
})();

(function backToTop() {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 480);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();

(function projectFilter() {
  document.addEventListener('DOMContentLoaded', () => {
    const bar = document.querySelector('.filter-bar');
    const cards = document.querySelectorAll('.project-card');
    if (!bar || !cards.length) return;

    bar.addEventListener('click', (event) => {
      const chip = event.target.closest('.filter-chip');
      if (!chip) return;

      bar.querySelectorAll('.filter-chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');

      const tech = chip.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card) => {
        const techs = (card.dataset.tech || '').split(',');
        const match = tech === 'all' || techs.includes(tech);
        card.hidden = !match;
        if (match) visibleCount += 1;
      });

      const emptyState = document.querySelector('.projects-empty');
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    });
  });
})();

(function contactForm() {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const status = form.querySelector('.form-status');
    const fields = form.querySelectorAll('input[required], textarea[required]');

    const validators = {
      name: (value) => value.trim().length >= 2 || 'Escribe tu nombre completo.',
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Ingresa un correo válido, por ejemplo nombre@dominio.com.',
      subject: (value) => value.trim().length >= 3 || 'Cuéntame brevemente el motivo del mensaje.',
      message: (value) => value.trim().length >= 10 || 'El mensaje debe tener al menos 10 caracteres.',
    };

    const validateField = (field) => {
      field.dataset.touched = 'true';
      const rule = validators[field.name];
      const result = rule ? rule(field.value) : true;
      const errorEl = document.querySelector(`#error-${field.name}`);
      if (result === true) {
        field.setCustomValidity('');
        if (errorEl) errorEl.textContent = '';
        return true;
      }
      field.setCustomValidity(result);
      if (errorEl) errorEl.textContent = result;
      return false;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.dataset.touched === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let allValid = true;
      fields.forEach((field) => {
        if (!validateField(field)) allValid = false;
      });

      status.classList.remove('success');
      if (!allValid) {
        status.textContent = 'Revisa los campos marcados antes de enviar el mensaje.';
        status.classList.add('visible');
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      status.textContent = `Gracias, ${form.name.value.trim().split(' ')[0]}. Tu mensaje quedó registrado y te responderé pronto a ${form.email.value.trim()}.`;
      status.classList.add('visible', 'success');
      form.reset();
      fields.forEach((f) => delete f.dataset.touched);
    });
  });
})();
