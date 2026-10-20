document.addEventListener('DOMContentLoaded', () => {
  // Menú Hamburguesa
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Lógica Modo Oscuro / Claro
  const themeToggles = [
    {
      btn: document.getElementById('theme-toggle'),
      sun: document.getElementById('theme-toggle-sun'),
      moon: document.getElementById('theme-toggle-moon')
    },
    {
      btn: document.getElementById('theme-toggle-mobile'),
      sun: document.getElementById('theme-toggle-sun-mobile'),
      moon: document.getElementById('theme-toggle-moon-mobile')
    }
  ];

  function updateIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    themeToggles.forEach(({ sun, moon }) => {
      if (sun && moon) {
        if (isDark) {
          sun.classList.remove('hidden');
          moon.classList.add('hidden');
        } else {
          sun.classList.add('hidden');
          moon.classList.remove('hidden');
        }
      }
    });
  }

  function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    updateIcons();
  }

  // Inicializar estado de íconos
  updateIcons();

  // Escuchar clics en los botones de tema
  themeToggles.forEach(({ btn }) => {
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });

  // Botón Volver Arriba (Scroll to Top)
  const btnScrollTop = document.getElementById('btnScrollTop');

  if (btnScrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnScrollTop.style.setProperty('opacity', '1', 'important');
        btnScrollTop.style.setProperty('pointer-events', 'auto', 'important');
      } else {
        btnScrollTop.style.setProperty('opacity', '0', 'important');
        btnScrollTop.style.setProperty('pointer-events', 'none', 'important');
      }
    });

    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});