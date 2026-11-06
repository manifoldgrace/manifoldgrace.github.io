(() => {
  'use strict';
  const pages = new Set(['books', 'services', 'products']);
  const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
  class BankRequest extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const page = this.getAttribute('page');
      if (!pages.has(page)) return;
      const root = this.attachShadow({mode: 'open'});
      root.innerHTML = `
        <style>
          :host { display:block; font:inherit; color:inherit; --mg-accent:var(--accent,#c8a56c); }
          * {box-sizing:border-box} [hidden]{display:none!important}
          section {background:var(--mg-surface,var(--surface,transparent));border:1px solid var(--mg-accent);border-radius:1rem;padding:clamp(1.1rem,4vw,2.3rem);margin:2rem 0}
          h2{font:inherit;font-size:clamp(1.6rem,4vw,2rem);margin:.4rem 0 1rem;line-height:1.2}
          .eyebrow{font-size:.875rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mg-accent)}
          p{line-height:1.6;margin:.75rem 0} .grid{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem}
          label{display:block;font-size:1rem;line-height:1.5}input,textarea{font:inherit;font-size:1rem;width:100%;margin:.4rem 0 0;padding:.8rem;border:1px solid var(--mg-input-border,#777);border-radius:.45rem;color:inherit;background:var(--mg-input-bg,transparent)}
          input:focus-visible,textarea:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid var(--mg-accent);outline-offset:3px}
          textarea{resize:vertical;min-height:6rem} .full{grid-column:1/-1}
          .hp{position:absolute;left:-99999px;width:1px;height:1px;overflow:hidden}.check{display:flex;gap:.7rem;align-items:flex-start}.check input{width:1.1rem;height:1.1rem;flex:none;margin:.3rem 0 0;accent-color:var(--mg-accent)}
          button,a.button{display:inline-block;padding:.85rem 1.1rem;border:1px solid var(--mg-accent);border-radius:.45rem;font:inherit;font-weight:600;cursor:pointer;text-decoration:none;background:var(--mg-accent);color:var(--mg-button-text,#141414)}
          button.secondary{background:transparent;color:inherit} .actions{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1rem}
          .summary{margin-top:1.5rem;padding-top:1.3rem;border-top:1px solid var(--mg-input-border,#777)}
          pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.6}
          small{display:block;font-size:.875rem;line-height:1.5;margin-top:.6rem} .status{font-size:1rem;line-height:1.5}
          @media(max-width:580px){.grid{grid-template-columns:1fr}.full{grid-column:auto}.actions>*{width:100%;text-align:center}}
          @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
        </style>
        <section aria-labelledby="heading">
          <div class="eyebrow">Orders &amp; enquiries</div>
          <h2 id="heading">Request a quote or information</h2>
          <p class="delivery-description">This form prepares an enquiry. Online submission activates only after the receiving service is configured; until then, the draft can be copied. No payment is taken here.</p>
          <form action="https://formspree.io/f/xoeebzbg" method="POST">
            <div class="hp" aria-hidden="true"><label>Leave this field blank<input name="_gotcha" type="text" tabindex="-1" autocomplete="off"></label></div>
            <div class="grid">
              <label>Your name<input name="name" autocomplete="name" required maxlength="100"></label>
              <label>Your email<input name="email" type="email" autocomplete="email" required maxlength="254"></label>
              <label class="full">Item or service<input name="item" required maxlength="160" placeholder="Name of the book, product or service"></label>
              <label>Quantity<input name="quantity" type="number" min="1" max="100" value="1" required step="1"></label>
              <label>Budget or timeframe (optional)<input name="timing" maxlength="120"></label>
              <label class="full">Your requirements (optional)<textarea name="message" maxlength="1200"></textarea></label>
              <label class="full check"><input name="invoice" type="checkbox"><span>Email me an invoice once the price is agreed.</span></label>
              <label class="full check"><input name="consent" type="checkbox" required><span>You may use these details to respond to this request.</span></label>
            </div>
            <p><small>Do not include card details, banking passwords or sensitive documents. Nothing is charged by this form.</small></p>
            <button type="submit">Prepare request (does not send)</button>
          </form>
          <div class="summary" hidden>
            <h3>Your request</h3>
            <pre></pre>
            <div class="actions">
              <a class="button" hidden>Open email to send</a>
              <a class="button secondary" href="https://www.linkedin.com/in/gracerose-uk" target="_blank" rel="noopener noreferrer">Contact via LinkedIn</a>
              <button type="button" class="secondary copy">Copy request</button>
              <button type="button" class="secondary edit">Edit request</button>
            </div>
            <p class="status" role="status" aria-live="polite"></p>
            <small>An enquiry is not a confirmed order, booking or payment. Do not include financial credentials or sensitive documents. We will agree price and availability separately.</small>
          </div>
        </section>`;
      const form = root.querySelector('form');
      const summary = root.querySelector('.summary');
      const status = root.querySelector('.status');
      const link = summary.querySelector('a');
      let body = '';
      let reference = '';
      const prefix = {books: 'BK', services: 'SV', products: 'PR'}[page];
      const endpoint = form.action;
      const live = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint);
      const submit = form.querySelector('button[type="submit"]');
      submit.textContent = live ? 'Send enquiry securely' : 'Form unavailable';
      root.querySelector('.delivery-description').textContent = live ? 'Send an enquiry for review using Formspree. No payment is taken here; a submission is not a confirmed order or booking.' : 'Enquiries are temporarily unavailable; please use the professional contact link.';
      const makeReference = () => {
        const bytes = crypto.getRandomValues(new Uint8Array(8));
        return `MG-${prefix}-${Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('').toUpperCase()}`;
      };
      form.addEventListener('submit', async event => {
        event.preventDefault();
        for (const key of ['name', 'item']) {
          form.elements.namedItem(key).setCustomValidity(form.elements.namedItem(key).value.trim() ? '' : 'Please enter a value.');
        }
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const clean = key => String(data.get(key) || '').trim();
        reference ||= makeReference();
        body = [
          'Manifold Grace enquiry / quote request',
          `Reference: ${reference}`, `Page: ${page}`,
          `Name: ${clean('name')}`, `Reply email: ${clean('email')}`,
          `Item / service: ${clean('item')}`, `Quantity: ${clean('quantity')}`,
          `Budget / timeframe: ${clean('timing') || 'Not specified'}`,
          `Invoice by email requested: ${data.get('invoice') ? 'Yes' : 'No'}`,
          `Requirements: ${clean('message') || 'Not specified'}`,
          'Permission to respond: Yes',
          '', 'Please confirm availability, price and payment instructions.',
          'This is a request only. No payment has been made.'
        ].join('\n');
        root.querySelector('pre').textContent = body;
        const inbox = String(window.MG_BANK_REQUEST?.enquiryEmail || '').trim();
        const configured = emailPattern.test(inbox) && !/[\r\n]/.test(inbox);
        link.hidden = !configured;
        if (configured) {
          link.href = `mailto:${encodeURIComponent(inbox)}?subject=${encodeURIComponent(`Enquiry ${reference}`)}&body=${encodeURIComponent(body)}`;
          status.textContent = 'Your request is ready. Open your email app and send it. If the email app does not open, copy the request and email it to ' + inbox + '.';
        } else {
          link.removeAttribute('href');
          status.textContent = 'Automated email delivery is not configured, and nothing has been sent. You may copy the request for later or contact Manifold Grace through LinkedIn. Do not assume that saving this page registers an enquiry or order.';
        }
        summary.hidden = false;
        summary.scrollIntoView({block:'nearest'});
        if (!live) return;
        // Hosted form service: endpoint must be enabled and verified by the site owner.
        // Fetch success means the provider accepted the submission, not that Gmail delivery has been independently proven.
        link.hidden = true;
        link.removeAttribute('href');
        submit.disabled = true;
        submit.textContent = 'Sending…';
        status.textContent = 'Sending your enquiry. Please do not close this page.';
        const outgoing = new FormData(form);
        outgoing.set('reference', reference);
        outgoing.set('page', page);
        outgoing.set('subject', 'Manifold Grace enquiry ' + reference);
        outgoing.set('consent', 'Yes');
        outgoing.set('invoice', data.get('invoice') ? 'Yes' : 'No');
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: outgoing,
            headers: { 'Accept': 'application/json' }
          });
          if (!response.ok) {
            status.textContent = response.status === 429 ?
              'The form provider is receiving too many requests. Please try again later; delivery is not confirmed.' :
              'The provider did not accept this enquiry. Nothing is confirmed. Please retry or copy your request.';
            return;
          }
          status.textContent = 'Your enquiry was accepted by the form service. Reference: ' + reference + '. This is not an order or payment confirmation.';
          submit.textContent = 'Enquiry submitted';
          return;
        } catch (error) {
          status.textContent = 'Could not verify submission. Do not assume it arrived. You can copy the request or try again.';
          return;
        } finally {
          if (submit.textContent !== 'Enquiry submitted') {
            submit.disabled = false;
            submit.textContent = 'Retry enquiry';
          }
        }
      });
      for (const key of ['name', 'item']) {
        form.elements.namedItem(key).addEventListener('input', () => form.elements.namedItem(key).setCustomValidity(''));
      }
      link.addEventListener('click', () => {
        status.textContent = 'Your email app has been requested. You must press Send there. This website cannot confirm email delivery.';
      });
      root.querySelector('.copy').addEventListener('click', async () => {
        if (!body) return;
        try {
          await navigator.clipboard.writeText(body);
          status.textContent = 'Request copied. Nothing has been sent.';
        } catch {
          status.textContent = 'Select the request text above and copy it manually. Nothing has been sent.';
        }
      });
      root.querySelector('.edit').addEventListener('click', () => {
        summary.hidden = true;
        form.elements.namedItem('item').focus();
      });
      this.addEventListener('mg-select-item', event => {
        const title = String(event.detail?.title || '').slice(0,160);
        form.elements.namedItem('item').value = title;
        form.elements.namedItem('item').focus();
        this.scrollIntoView({block:'start'});
      });
    }
  }
  if (!customElements.get('mg-bank-request')) customElements.define('mg-bank-request', BankRequest);
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-mg-request]');
    if (!trigger) return;
    const target = document.querySelector('mg-bank-request');
    if (!target) return;
    event.preventDefault();
    target.dispatchEvent(new CustomEvent('mg-select-item', {detail:{title:trigger.getAttribute('data-mg-request')}}));
  });
})();
