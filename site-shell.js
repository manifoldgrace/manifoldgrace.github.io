(() => {
  "use strict";
  const site = window.MANIFOLD_SITE || {};
  const navGroups = [
    [
      "Research & Knowledge",
      [
        [
          "Research",
          "research.html"
        ],
        [
          "Emerging Research Horizon",
          "emerging-horizon-research.html"
        ],
        [
          "Research Novelty & Fields",
          "research-novelty-field-formation.html"
        ],
        [
          "AI Competence & Recruitment",
          "interdisciplinary-ai-competence-recruitment.html"
        ],
        [
          "Interdisciplinary Atlas",
          "interdisciplinary-research-atlas.html"
        ],
        [
          "AI Discovery & Inventory",
          "ai-identifiability-discovery-inventory-atlas.html"
        ],
        [
          "AI Governance",
          "ai-identifiability-compliance-governance.html"
        ],
        [
          "Information Science",
          "information-science.html"
        ],
        [
          "Knowledge VS Thinking",
          "knowledge.html"
        ],
        [
          "Learning Lab",
          "learning-lab.html"
        ],
        [
          "Research Collaborations",
          "research-collaborations.html"
        ],
        [
          "Research Questions & Solutions",
          "research-questions-gaps-solutions.html"
        ]
      ]
    ],
    [
      "Professional & Records",
      [
        [
          "Professional",
          "professional.html"
        ],
        [
          "Recognition",
          "recognition.html"
        ],
        [
          "Independent Work & Impact",
          "independent-work-impact.html"
        ],
        [
          "Productivity Log",
          "productivity-log.html"
        ],
        [
          "Why Daily Logs Matter",
          "why-daily-logs-matter.html"
        ],
        [
          "Independent Coverage",
          "independent-coverage.html"
        ],
        [
          "About",
          "about.html"
        ],
        [
          "Life Timeline",
          "life-timeline.html"
        ],
        [
          "Services",
          "services.html"
        ]
      ]
    ],
    [
      "Society & Governance",
      [
        [
          "Society",
          "society.html"
        ],
        [
          "Government & Society",
          "government-arms.html"
        ],
        [
          "Labour Market Analysis",
          "labour-market-analysis.html"
        ],
        [
          "Public",
          "public.html"
        ],
        [
          "Sociology",
          "topics-in-12.html#domain-01"
        ],
        [
          "Life Philosophy",
          "life-philosophy.html"
        ]
      ]
    ],
    [
      "Culture & Life",
      [
        [
          "Heritage",
          "heritage.html"
        ],
        [
          "From Heritage to Life",
          "heritage-benefits.html"
        ],
        [
          "Names & Notable People",
          "heritage-further-study.html"
        ],
        [
          "Royal Lineage",
          "royal-lineage.html"
        ],
        [
          "Faith",
          "faith.html"
        ],
        [
          "Photos",
          "photos.html"
        ],
        [
          "Travel",
          "travel.html"
        ],
        [
          "Socials",
          "socials.html"
        ],
        [
          "Resourcefulness",
          "resourcefulness.html"
        ]
      ]
    ],
    [
      "Creative & Enterprise",
      [
        [
          "Creative",
          "creative.html"
        ],
        [
          "My Books",
          "my-book.html"
        ],
        [
          "App Design Ideas",
          "app-design-ideas.html"
        ],
        [
          "Venture",
          "conglomerate.html"
        ],
        [
          "Trading",
          "trading.html"
        ]
      ]
    ]
  ];
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-site-nav]").forEach((nav) => {
    const wrap = document.createElement("div");
    wrap.className = "nav-links nav-groups";
    const toggles = [];
    navGroups.forEach(([title, items]) => {
      const details = document.createElement("details");
      details.className = "site-nav-group";
      const summary = document.createElement("summary");
      summary.textContent = title;
      details.appendChild(summary);
      const links = document.createElement("div");
      links.className = "site-nav-panel";
      items.forEach(([label, href]) => {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        const target = href.toLowerCase().split("#")[0];
        if (path === target) {
          a.setAttribute("aria-current", "page");
          summary.classList.add("has-current");
        }
        links.appendChild(a);
      });
      details.appendChild(links);
      details.addEventListener("toggle", () => {
        if (details.open) toggles.forEach(other => { if(other !== details) other.open = false; });
      });
      toggles.push(details);
      wrap.appendChild(details);
    });
    nav.setAttribute("aria-label", "Explore Manifold Grace by topic");
    nav.replaceChildren(wrap);
    nav.addEventListener("keydown", (event) => {
      if(event.key === "Escape") {
        toggles.forEach(d => d.open = false);
        const summary = event.target.closest("details")?.querySelector("summary");
        if(summary) summary.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if(!nav.contains(event.target)) toggles.forEach(d => d.open = false);
    });
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
    ["LLM Evaluation & Governance","llm-evaluation-governance.html"],
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

