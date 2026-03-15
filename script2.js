const REVIEWS_KEY = 'td_reviews';

const defaultReviews = [
];

function loadUserReviews() {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  } catch { return []; }
}

function loadReviews() {
  return [...loadUserReviews(), ...defaultReviews];
}

function saveReview(r) {
  try {
    const stored = loadUserReviews();
    stored.unshift(r);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(stored));
  } catch {}
}

function deleteReview(id) {
  try {
    const stored = loadUserReviews().filter(r => r.id !== id);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(stored));
    renderAll();
  } catch {}
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function starsStr(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function renderStars(container, val) {
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement('span');
    s.textContent = '★';
    s.style.color = i <= val ? '#f5c518' : 'rgba(255,255,255,0.2)';
    s.style.fontSize = '15px';
    container.appendChild(s);
  }
}

function renderSummary(reviews) {
  const total = reviews.length;
  const avg = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0.0';
  document.getElementById('avgRating').textContent = avg;
  document.getElementById('ratingCount').textContent = total + ' ' + (total === 1 ? 'отзыв' : total < 5 ? 'отзыва' : 'отзывов');
  renderStars(document.getElementById('avgStars'), Math.round(avg));

  const bars = document.getElementById('barsContainer');
  bars.innerHTML = '';
  for (let s = 5; s >= 1; s--) {
    const cnt = reviews.filter(r => r.rating === s).length;
    const pct = total ? Math.round(cnt / total * 100) : 0;
    bars.innerHTML += `<div class="bar-row"><span>${s}★</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span>${cnt}</span></div>`;
  }
}

function renderCard(r, isOwn) {
  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `
    <div class="review-header">
      <div class="reviewer">
        <div class="avatar">${initials(r.name)}</div>
        <div>
          <div class="reviewer-name">${r.name}</div>
          <div class="reviewer-date">${r.date || ''}</div>
        </div>
      </div>
      <div class="review-header-right">
        <div class="review-stars">${starsStr(r.rating)}</div>
        ${isOwn ? `<button class="delete-btn" onclick="deleteReview('${r.id}')">✕ Удалить</button>` : ''}
      </div>
    </div>
    <div class="review-text">${r.text}</div>
    ${r.route ? `<span class="route-tag">🚖 ${r.route}</span>` : ''}
  `;
  return card;
}

function renderAll() {
  const userIds = new Set(loadUserReviews().map(r => r.id));
  const reviews = loadReviews();
  renderSummary(reviews);
  const list = document.getElementById('reviewsList');
  list.innerHTML = '';
  reviews.forEach((r, i) => {
    const card = renderCard(r, userIds.has(r.id));
    list.appendChild(card);
    setTimeout(() => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { card.classList.add('visible'); obs.unobserve(card); }
        });
      }, { threshold: 0.1 });
      obs.observe(card);
    }, i * 60);
  });
}

let selectedRating = 0;
const starsInput = document.getElementById('starsInput');
starsInput.querySelectorAll('span').forEach(s => {
  s.addEventListener('click', () => {
    selectedRating = +s.dataset.v;
    starsInput.querySelectorAll('span').forEach(x => x.classList.toggle('active', +x.dataset.v <= selectedRating));
  });
  s.addEventListener('mouseover', () => {
    starsInput.querySelectorAll('span').forEach(x => x.classList.toggle('active', +x.dataset.v <= +s.dataset.v));
  });
  s.addEventListener('mouseout', () => {
    starsInput.querySelectorAll('span').forEach(x => x.classList.toggle('active', +x.dataset.v <= selectedRating));
  });
});

function submitReview() {
  const name = document.getElementById('inputName').value.trim();
  const text = document.getElementById('inputText').value.trim();
  if (!name) { document.getElementById('inputName').focus(); return; }
  if (!selectedRating) { starsInput.style.outline = '1px solid rgba(245,197,24,0.5)'; return; }
  if (!text) { document.getElementById('inputText').focus(); return; }

  const route = document.getElementById('inputRoute').value.trim();
  const now = new Date();
  const date = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const id = 'u_' + Date.now();

  saveReview({ id, name, rating: selectedRating, text, route, date });
  document.getElementById('successMsg').style.display = 'block';
  document.querySelector('.submit-btn').style.display = 'none';

  setTimeout(() => {
    document.getElementById('inputName').value = '';
    document.getElementById('inputText').value = '';
    document.getElementById('inputRoute').value = '';
    document.getElementById('successMsg').style.display = 'none';
    document.querySelector('.submit-btn').style.display = 'block';
    selectedRating = 0;
    starsInput.querySelectorAll('span').forEach(x => x.classList.remove('active'));
    renderAll();
  }, 1800);
}

renderAll();