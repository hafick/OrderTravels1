const cards = document.querySelectorAll('.feature-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

cards.forEach(card => observer.observe(card));

document.querySelector('.fab').addEventListener('click', () => {
  document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
});
