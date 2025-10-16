document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.createElement('button');

  // Lazy-load images (skip brand/logo)
  document.querySelectorAll('img').forEach((img) => {
    const isLogo = img.classList.contains('logo-img');
    if (!isLogo && !img.loading) {
      img.loading = 'lazy';
    }
  });

  // Navbar shadow on scroll
  const updateNavbarShadow = () => {
    if (!navbar) return;
    if (window.scrollY > 2) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };

  // Back to top button
  backToTopBtn.id = 'backToTop';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.title = 'Back to top';
  backToTopBtn.textContent = '↑';
  document.body.appendChild(backToTopBtn);

  const updateBackToTop = () => {
    if (window.scrollY > 120) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Init and listeners
  updateNavbarShadow();
  updateBackToTop();
  window.addEventListener('scroll', () => {
    updateNavbarShadow();
    updateBackToTop();
  }, { passive: true });
});


