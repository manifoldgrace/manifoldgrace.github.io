(() => {
  "use strict";
  const input = document.getElementById("linkSearch");
  const groups = [...document.querySelectorAll("[data-link-group]")];
  if (!input) return;
  const noMatch = document.getElementById("linkNoMatch");
  const proposal = document.getElementById("linkProposal");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    let totalMatches = 0;
    groups.forEach((group) => {
      let matches = 0;
      group.querySelectorAll("li").forEach((li) => {
        const hit = !q || li.textContent.toLowerCase().includes(q);
        li.hidden = !hit;
        if (hit) matches++;
      });
      totalMatches += matches;
      group.hidden = Boolean(q && matches === 0);
      if (q && matches) group.open = true;
    });
    if (noMatch) noMatch.hidden = !(q && totalMatches === 0);
    if (proposal && q && totalMatches === 0) {
      const title = "Research resource category proposal: " + q.slice(0, 100);
      const body = "Suggested public research category: " + q.slice(0, 100) + "\n\nRelevant public sources to assess:\n\nWhy this category is needed:\n";
      proposal.href = "https://github.com/manifoldgrace/manifoldgrace.github.io/issues/new?title=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body);
    }
  });
})();