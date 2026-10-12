(() => {
  'use strict';
  const cards = [...document.querySelectorAll('.destination')];
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'All' && card.dataset.region !== button.dataset.filter; });
    document.getElementById('destination-count').textContent = `${cards.filter(c => !c.hidden).length} destinations`;
  }));
  document.querySelectorAll('.load-map').forEach(button => button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = `${button.dataset.name} destination map`;
    frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(button.dataset.bbox)}&layer=mapnik&marker=${encodeURIComponent(button.dataset.marker)}`;
    frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer';
    button.replaceWith(frame);
  }));
  const form = document.getElementById('journey-planner');
  const status = document.getElementById('planner-status');
  const fields = ['destination', 'focus', 'budget', 'transport', 'itinerary', 'question', 'lesson'];
  const key = 'manifold-grace-travel-plan-v1';
  const getPlan = () => Object.fromEntries(fields.map(f => [f, form.elements.namedItem(f).value]));
  function restore(plan) {
    if (!plan || typeof plan !== 'object' || Array.isArray(plan)) throw new Error('Invalid plan');
    fields.forEach(f => { if (typeof plan[f] === 'string') form.elements.namedItem(f).value = plan[f].slice(0, 4000); });
  }
  try { const saved = localStorage.getItem(key); if (saved) { restore(JSON.parse(saved)); status.textContent = 'Saved draft restored from this browser.'; } } catch { status.textContent = 'Device storage is unavailable. You can still download your draft.'; }
  form.addEventListener('submit', event => { event.preventDefault(); try { localStorage.setItem(key, JSON.stringify(getPlan())); status.textContent = 'Draft saved in this browser. Download a copy for another device.'; } catch { status.textContent = 'Could not save on this device. Please download your draft.'; } });
  document.getElementById('export-plan').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(getPlan(), null, 2)], {type:'application/json'}));
    const a = document.createElement('a'); a.href = url; a.download = 'travel-learning-plan.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); status.textContent = 'Draft prepared for download.';
  });
  document.getElementById('import-plan').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try { if (file.size > 100000) throw new Error('Too large'); restore(JSON.parse(await file.text())); status.textContent = 'Draft imported. Use Save draft to keep it on this device.'; } catch { status.textContent = 'Could not import this file. Select a downloaded travel plan JSON file.'; }
    event.target.value = '';
  });
})();
