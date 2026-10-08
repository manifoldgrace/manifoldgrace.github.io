(() => {
  "use strict";
  const site = window.MANIFOLD_SITE || {};
  const navItems = [
    ["About","about.html"],
    ["My Books","my-book.html"],
    ["50 by 30","50-things.html"],
    ["Research","research.html"],
    ["Trading","trading.html"],
    ["Professional","professional.html"],
    ["Creative","creative.html"],
    ["Public","public.html"],
    ["Faith","faith.html"],
    ["Heritage","heritage.html"],
    ["Recognition","recognition.html"],
    ["Venture","conglomerate.html"],
    ["Archive","archive.html"]
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
    ["Inspirations","inspirations.html"],
    ["Biography","biographical-record.html"],
    ["Research Links","research-links.html"],
    ["Case Studies","case-studies.html"],
    ["Papers","papers.html"],
    ["Digital CV","cv.html"],
    ["Public Speaking","public-speaking.html"],
    ["Live Sessions","live-sessions.html"],
    ["Photos","photos.html"],
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
    note.textContent = "Manifold Grace · selected public record · private life remains private";
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