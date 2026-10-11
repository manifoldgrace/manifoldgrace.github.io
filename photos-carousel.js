(() => {
  "use strict";
  document.querySelectorAll('.published-photo-set').forEach((track) => {
    if (track.children.length < 2) return;
    const controls = document.createElement('div');
    controls.className = 'photo-carousel-controls';
    const buttons = [-1, 1].map((direction) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = direction < 0 ? '←' : '→';
      button.setAttribute('aria-label', direction < 0 ? 'Previous photographs' : 'Next photographs');
      button.setAttribute('aria-controls', track.id);
      button.addEventListener('click', () => track.scrollBy({
        left: direction * 226,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      }));
      controls.appendChild(button);
      return button;
    });
    const update = () => {
      buttons[0].disabled = track.scrollLeft <= 1;
      buttons[1].disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };
    track.before(controls);
    track.addEventListener('scroll', update, {passive: true});
    new ResizeObserver(update).observe(track);
    update();
  });
})();
