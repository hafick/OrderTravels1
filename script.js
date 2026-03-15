const cards = document.querySelectorAll('.feature-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => obs.observe(c));
 
  const fab = document.querySelector('.fab');
  const ctaObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        fab.style.opacity = '0';
        fab.style.pointerEvents = 'none';
      } else {
        fab.style.opacity = '1';
        fab.style.pointerEvents = 'auto';
      }
    });
  }, { threshold: 1.0 });
  ctaObs.observe(document.getElementById('cta'));