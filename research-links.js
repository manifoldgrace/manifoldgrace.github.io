(() => {
  "use strict";
  const input = document.getElementById("linkSearch");
  const groups = [...document.querySelectorAll("[data-link-group]")];
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    groups.forEach((group) => {
      let matches = 0;
      group.querySelectorAll("li").forEach((li) => {
        const hit = !q || li.textContent.toLowerCase().includes(q);
        li.hidden = !hit;
        if (hit) matches++;
      });
      group.hidden = q && matches === 0;
      if (q && matches) group.open = true;
    });
  });
})();