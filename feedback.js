(() => {
  "use strict";
  const form = document.getElementById("feedback-form");
  const status = document.getElementById("feedback-state");
  const submit = document.getElementById("feedback-submit");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    status.hidden = false;
    status.textContent = "Submitting feedback…";
    try {
      const response = await fetch(form.action, {method: "POST", body: new FormData(form), headers: {Accept: "application/json"}});
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      status.textContent = "Thank you. Your feedback was submitted for private review. It will not appear publicly unless you selected public display and it is approved.";
    } catch (error) {
      status.textContent = "Your feedback could not be confirmed. Please try again or use the contact page.";
    } finally { submit.disabled = false; }
  });
  const target = document.getElementById("feedback-public");
  const shortDate = value => {
    const date = new Date(value + "T12:00:00Z");
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
  };
  fetch("data/approved-feedback.json", {cache:"no-store"}).then(res => {if(!res.ok)throw new Error("Unavailable");return res.json();}).then(data => {
    if(!Array.isArray(data) || !target) return;
    const entries = data.filter(item => item && item.approved === true && item.publication_permission === true && typeof item.message === "string" && item.message.trim() && /^\d{4}-\d{2}-\d{2}$/.test(item.published_on || ""));
    if (!entries.length) return;
    target.replaceChildren();
    entries.sort((a,b) => b.published_on.localeCompare(a.published_on));
    entries.forEach(item => {
      const article = document.createElement("article"); article.className = "review-card";
      const heading = document.createElement("h3"); heading.textContent = String(item.category || "Visitor feedback").slice(0,100);
      const quote = document.createElement("blockquote"); quote.textContent = item.message.slice(0,2000);
      const meta = document.createElement("p"); meta.className = "review-meta";
      meta.textContent = [String(item.display_name || "Anonymous").slice(0,80),shortDate(item.published_on)].filter(Boolean).join(" · ");
      article.append(heading,quote,meta); target.append(article);
    });
  }).catch(() => { if(target)target.textContent = "Published feedback is temporarily unavailable."; });
})();