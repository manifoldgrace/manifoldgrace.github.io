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
          .check{display:flex;gap:.7rem;align-items:flex-start}.check input{width:1.1rem;height:1.1rem;flex:none;margin:.3rem 0 0;accent-color:var(--mg-accent)}
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
          <p>Tell us what you need. We’ll confirm availability, the agreed price and bank-transfer instructions before you pay.</p>
          <form>
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
            <button type="submit">Review request</button>
          </form>
          <div class="summary" hidden>
            <h3>Your request</h3>
            <pre></pre>
            <div class="actions">
              <a class="button" hidden>Open email to send</a>
              <button type="button" class="secondary copy">Copy request</button>
              <button type="button" class="secondary edit">Edit request</button>
            </div>
            <p class="status" role="status" aria-live="polite"></p>
            <small>We confirm payment only after it appears in our bank account. An enquiry or invoice request is not a payment confirmation.</small>
          </div>
        </section>`;
      const form = root.querySelector('form');
      const summary = root.querySelector('.summary');
      const status = root.querySelector('.status');
      const link = summary.querySelector('a');
      let body = '';
      let reference = '';
      const prefix = {books: 'BK', services: 'SV', products: 'PR'}[page];
      const makeReference = () => {
        const bytes = crypto.getRandomValues(new Uint8Array(8));
        return `MG-${prefix}-${Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('').toUpperCase()}`;
      };
      form.addEventListener('submit', event => {
        event.preventDefault();
        for (const key of ['name', 'item']) {
          form.elements[key].setCustomValidity(form.elements[key].value.trim() ? '' : 'Please enter a value.');
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
          status.textContent = 'Email requests are not available yet. Nothing has been sent. You can copy this request for later.';
        }
        summary.hidden = false;
        summary.scrollIntoView({block:'nearest'});
      });
      for (const key of ['name', 'item']) {
        form.elements[key].addEventListener('input', () => form.elements[key].setCustomValidity(''));
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
        form.elements.item.focus();
      });
      this.addEventListener('mg-select-item', event => {
        const title = String(event.detail?.title || '').slice(0,160);
        form.elements.item.value = title;
        form.elements.item.focus();
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
