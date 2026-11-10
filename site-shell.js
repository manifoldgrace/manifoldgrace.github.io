(() => {
  "use strict";
  const site = window.MANIFOLD_SITE || {};
  // Shared disclosure enhancement; if loading fails, original page content remains visible.
  if (!document.querySelector('script[src*="site-disclosure.js"]')) {
    const disclosureScript = document.createElement("script");
    disclosureScript.src = "assets/site-disclosure.js?v=20261110-1";
    disclosureScript.defer = true;
    document.head.appendChild(disclosureScript);
  }
  // Share the five-second page transition across pages using the common shell.
  // Pages that already include the loader directly must not load it a second time.
  if (!document.querySelector('script[src*="loading-scenes.js"]')) {
    const transitionScript = document.createElement("script");
    transitionScript.src = "loading-scenes.js?v=20261108-unique-patterns-1";
    transitionScript.defer = true;
    document.head.appendChild(transitionScript);
  }

  const navGroups = [
    [
      "Research & Knowledge",
      [
        [
          "Research",
          "research.html"
        ],
        [
          "Historical Corridors & AI Recordkeeping",
          "historical-corridors-ai-recordkeeping.html"
        ],
        [
          "Designing Fairer Systems",
          "designing-fairer-systems.html"
        ],
        [
          "MILES Research Architecture",
          "miles-research.html"
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
          "Research Transfer & Scope",
          "research-transfer-scope-completion.html"
        ],
        [
          "AI Competence & Recruitment",
          "interdisciplinary-ai-competence-recruitment.html"
        ],
        [
          "Semantic Integrity & Public Communication",
          "semantic-integrity-public-communication-assurance.html"
        ],
        [
          "Semantic Integrity Frontier 2026",
          "semantic-integrity-frontier-2026.html"
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
          "Contact",
          "contact.html"
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
          "Family History & Genealogy",
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
          "Company Intelligence & Financing",
          "company-intelligence-development-financing.html"
        ],
        [
          "Venture",
          "conglomerate.html"
        ],
        [
          "Team",
          "team.html"
        ],
        [
          "Careers",
          "careers.html"
        ],
        [
          "Trading",
          "trading.html"
        ]
      ]
    ],
    [
      "Public Interest AI",
      [
        ["Register a Project", "public-interest-ai.html?intent=project#register"],
        ["Request Independent Assessment", "public-interest-ai.html?intent=assessment#register"],
        ["Become a Reviewer", "public-interest-ai.html?intent=reviewer#register"],
        ["Research Collaboration", "public-interest-ai.html?intent=collaboration#register"],
        ["Assessment Approach", "public-interest-ai.html#assessment"],
        ["Discover Projects", "public-interest-ai.html#discover"]
      ]
    ],
  ];
  // A visual mnemonic, not a statement of evidence status.
  const notation = Object.freeze({
    "Research & Knowledge": ["⊢", "01 // RK"],
    "Professional & Records": ["◫", "02 // PR"],
    "Society & Governance": ["△", "03 // SG"],
    "Culture & Life": ["¶", "04 // CL"],
    "Creative & Enterprise": ["⊕", "05 // CE"],
    "Public Interest AI": ["◎", "06 // PI"]
  });
  function addNotation(summary, title) {
    const mark = notation[title];
    if (!mark) { summary.textContent = title; return; }
    const symbol = document.createElement("span");
    symbol.className = "mg-notation-glyph";
    symbol.textContent = mark[0];
    symbol.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.className = "mg-notation-name";
    name.textContent = title;
    const code = document.createElement("span");
    code.className = "mg-notation-code";
    code.textContent = mark[1];
    code.setAttribute("aria-hidden", "true");
    summary.append(symbol, name, code);
    summary.setAttribute("aria-label", title);
  }
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-site-nav]").forEach((nav) => {
    const wrap = document.createElement("div");
    wrap.className = "nav-links nav-groups";
    const toggles = [];
    navGroups.forEach(([title, items]) => {
      const details = document.createElement("details");
      details.className = "site-nav-group";
      const summary = document.createElement("summary");
      addNotation(summary, title);
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
    ["Products","products.html"],
    ["Team","team.html"],
    ["Careers","careers.html"],
    ["Public Interest AI","public-interest-ai.html"]
  ];
  const footerGroups = [
    ["Research & Knowledge", [0, 4, 5, 6, 7, 8, 9]],
    ["Professional & Records", [2, 3, 10, 11]],
    ["Culture & Life", [1, 12]],
    ["Creative & Enterprise", [13, 14, 15]],
    ["Public Interest AI", [16]]
  ];
  document.querySelectorAll("[data-site-footer]").forEach((footer) => {
    const top = document.createElement("nav");
    top.className = "footer-links footer-menu-groups";
    top.setAttribute("aria-label", "Footer navigation by topic");
    const toggles = [];
    footerGroups.forEach(([title, indexes]) => {
      const details = document.createElement("details");
      details.className = "site-footer-group";
      const summary = document.createElement("summary");
      addNotation(summary, title);
      const panel = document.createElement("div");
      panel.className = "site-footer-panel";
      indexes.forEach(index => {
        const [label, href] = secondary[index];
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        if (path === href.toLowerCase().split("#")[0]) {
          a.setAttribute("aria-current", "page");
          summary.classList.add("has-current");
        }
        panel.appendChild(a);
      });
      details.append(summary, panel);
      details.addEventListener("toggle", () => {
        if (details.open) toggles.forEach(other => { if (other !== details) other.open = false; });
      });
      toggles.push(details);
      top.appendChild(details);
    });
    top.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        toggles.forEach(details => { details.open = false; });
        event.target.closest("details")?.querySelector("summary")?.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!top.contains(event.target)) toggles.forEach(details => { details.open = false; });
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

