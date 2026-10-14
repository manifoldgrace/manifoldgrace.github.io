(() => {
  "use strict";
  const site = window.MANIFOLD_SITE || {};
  const navItems = [
    ["Research Collaborations","research-collaborations.html"],
    ["Independent Work & Impact","independent-work-impact.html"],
    ["About","about.html"],
    ["Life Timeline","life-timeline.html"],
    ["Professional","professional.html"],
    ["Photos","photos.html"],
    ["My Books","my-book.html"],
    ["Knowledge VS Thinking","knowledge.html"],
    ["Learning Lab","learning-lab.html"],
    ["Research","research.html"],
    ["Labour Market Analysis","labour-market-analysis.html"],
    ["Trading","trading.html"],
    ["Socials","socials.html"],
    ["Travel","travel.html"],
    ["Services","services.html"],
    ["Creative","creative.html"],
    ["Public","public.html"],
    ["Faith","faith.html"],
    ["Life Philosophy","life-philosophy.html"],
    ["Society","society.html"],
    ["Heritage","heritage.html"],
    ["Sociology","topics-in-12.html#domain-01"],
    ["Recognition","recognition.html"],
    ["Resourcefulness","resourcefulness.html"],
    ["Venture","conglomerate.html"]
  ];
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-site-nav]").forEach((nav) => {
    const wrap = document.createElement("div");
    wrap.className = "nav-links";
    navItems.forEach(([label, href]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      if (path === href.toLowerCase()) a.setAttribute("aria-current","page");
      wrap.appendChild(a);
    });
    nav.replaceChildren(wrap);
  });

  const secondary = [
    ["Thinking","knowledge.html#thinking"],
    ["Inspirations","inspirations.html"],
    ["Biography","biographical-record.html"],
    ["Life Timeline","life-timeline.html"],
    ["Research Collaborations","research-collaborations.html"],
    ["Research Links","research-links.html"],
    ["Case Studies","case-studies.html"],
    ["AI Research Lab","ai-research-lab.html"],
    ["Papers","papers.html"],
    ["Digital CV","cv.html"],
    ["Public Speaking","public-speaking.html"],
    ["Live Sessions","live-sessions.html"],
    ["Socials","socials.html"],
    ["Products","products.html"]
  ];
  document.querySelectorAll("[data-site-footer]").forEach((footer) => {
    const top = document.createElement("div");
    top.className = "footer-links";
    secondary.forEach(([label, href]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      top.appendChild(a);
    });
    const note = document.createElement("p");
    note.className = "footer-note";
    note.textContent = "Manifold Grace · selected public record";
    footer.replaceChildren(top,note);
  });

  document.querySelectorAll("[data-profile-link]").forEach((a) => {
    const key = a.getAttribute("data-profile-link");
    const url = site.links && site.links[key];
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      const container = a.closest("[data-hide-if-missing]") || a;
      container.hidden = true;
    }
  });
})();

