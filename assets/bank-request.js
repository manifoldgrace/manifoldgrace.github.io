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
          section {background:var(--mg-surface,var(--surface,#171717));border:1px solid var(--mg-input-border,#414141);border-radius:1.15rem;padding:clamp(1.25rem,4vw,2.25rem);margin:2rem 0;box-shadow:0 14px 42px rgba(0,0,0,.11)}
          h2{font:inherit;font-size:clamp(1.45rem,3.5vw,1.85rem);font-weight:650;margin:.35rem 0 .7rem;line-height:1.25;letter-spacing:-.025em}
          .eyebrow{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mg-accent)}
          p{line-height:1.55;margin:.6rem 0 1.25rem;max-width:65ch} .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.15rem}
          label{display:block;font-size:.91rem;font-weight:600;line-height:1.45}input,textarea,select{font:inherit;font-size:1rem;font-weight:400;width:100%;min-width:0;margin:.42rem 0 0;padding:.84rem .95rem;min-height:3rem;border:1px solid var(--mg-input-border,#666);border-radius:.72rem;color:inherit;background:var(--mg-input-bg,#1c1c1c);transition:border-color .15s,box-shadow .15s}select option{background:#1b1b1b;color:#fff}input:hover,textarea:hover,select:hover{border-color:var(--mg-accent)}input:focus,textarea:focus,select:focus{outline:2px solid var(--mg-accent);outline-offset:1px}input[readonly]{opacity:.9;background:rgba(128,128,128,.10)}.hint{font-size:.78rem;font-weight:400;opacity:.8;display:block;margin:.32rem 0 0}.price-info{border:1px solid var(--mg-input-border,#666);border-radius:.8rem;padding:.9rem 1rem;margin:.65rem 0 .3rem;background:rgba(130,130,130,.09)}.price-info strong{font-size:1.2rem}.price-info p{font-size:.8rem;margin:.35rem 0 0}
          button:focus-visible,a:focus-visible{outline:3px solid var(--mg-accent);outline-offset:3px}
          textarea{resize:vertical;min-height:7rem} .full{grid-column:1/-1}
          .hp{position:absolute;left:-99999px;width:1px;height:1px;overflow:hidden}.check{display:flex;gap:.75rem;align-items:flex-start;font-weight:400}.check input{width:1.1rem;height:1.1rem;min-height:0;flex:none;margin:.17rem 0 0;accent-color:var(--mg-accent)}.field-block{padding:1rem 0 0;border-top:1px solid var(--mg-input-border,#666);margin-top:1rem}.note{font-size:.84rem;opacity:.83}.form-actions{padding-top:1rem}.send-button{width:100%;min-height:3.15rem}
          button,a.button{display:inline-block;padding:.85rem 1.2rem;border:1px solid var(--mg-accent);border-radius:.7rem;font:inherit;font-weight:650;cursor:pointer;text-decoration:none;background:var(--mg-accent);color:var(--mg-button-text,#141414)}button:disabled{opacity:.66;cursor:default}
          button.secondary{background:transparent;color:inherit} .actions{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1rem}
          .summary{margin-top:1.4rem;padding-top:1.3rem;border-top:1px solid var(--mg-input-border,#777)}.sent-confirmation{border:1px solid var(--mg-input-border,#777);border-radius:.9rem;padding:1.4rem;margin-top:1rem;background:rgba(130,130,130,.08)}.sent-confirmation h3{margin:.2rem 0 .5rem}.sent-reference{font-variant-numeric:tabular-nums;overflow-wrap:anywhere;font-weight:650}
          pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.6}
          small{display:block;font-size:.875rem;line-height:1.5;margin-top:.6rem} .status{font-size:1rem;line-height:1.5}
          @media(max-width:580px){.grid{grid-template-columns:1fr}.full{grid-column:auto}.actions>*{width:100%;text-align:center}section{padding:1.15rem}.form-actions button{width:100%}}
          @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
        </style>
        <section aria-labelledby="heading">
          <div class="eyebrow">MANIFOLD GRACE · ENQUIRIES</div>
          <h2 id="heading"></h2>
          <p class="delivery-description"></p>
          <form action="https://formspree.io/f/xoeebzbg" method="POST">
            <div class="hp" aria-hidden="true"><label>Leave this field blank<input name="_gotcha" type="text" tabindex="-1" autocomplete="off"></label></div>
            <div class="grid">
              <label class="full">Full name<input name="name" autocomplete="name" required maxlength="100" placeholder="Your full name"></label>
              <label class="full">Email address<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></label>
              <label class="full product-only" hidden>Product or design concept
                <select name="product_selection">
                  <option value="">Select an item</option>
                </select>
                <span class="hint">Listed prices are proposed design-stage figures, not confirmed retail offers.</span>
              </label>
              <div class="full product-only price-info" hidden aria-live="polite">
                <span class="note">Proposed unit price</span>
                <div><strong class="selected-price">Select a design</strong></div>
                <p>Final price, manufacturing, availability, delivery and returns terms require confirmation before ordering.</p>
              </div>
              <label class="full standard-item">Book or service required<input name="item" maxlength="160" required placeholder="Describe what you're enquiring about"></label>
              <label>Quantity<input name="quantity" type="number" min="1" max="100" value="1" required step="1"></label>
              <label class="standard-timing">Preferred timeframe (optional)<input name="timing" maxlength="120" placeholder="e.g. next month"></label>
              <label class="full">Additional details (optional)<textarea name="message" maxlength="1200" placeholder="Any relevant specifications or questions"></textarea></label>
            </div>
            <div class="field-block">
              <label class="check standard-invoice"><input name="invoice" type="checkbox"><span>I'd like an invoice if we agree a price.</span></label>
              <label class="check"><input name="consent" type="checkbox" required><span>I agree that Manifold Grace may use these details to respond to my enquiry.</span></label>
            </div>
            <div class="form-actions">
              <button type="submit" class="send-button">Send enquiry</button>
              <p class="note">No payment is taken by this form. Please don't submit card details or sensitive documents.</p>
            </div>
          </form>
          <div class="sent-confirmation" hidden role="status" aria-live="polite">
            <h3>Enquiry submitted</h3>
            <p class="sent-reference"></p>
            <p>Thank you. Your enquiry has been received by the form service. This is not an order, booking or payment confirmation.</p>
            <button type="button" class="secondary new-enquiry">Send another enquiry</button>
          </div>
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
      const confirmation = root.querySelector('.sent-confirmation');
      const status = root.querySelector('.status');
      const link = summary.querySelector('a');
      let body = '';
      let reference = '';
      const prefix = {books: 'BK', services: 'SV', products: 'PR'}[page];
      const endpoint = form.action;
      const productSelect = form.elements.namedItem('product_selection');
      const itemInput = form.elements.namedItem('item');
      const priceLabel = root.querySelector('.selected-price');
      const priceMap = new Map();
      if (page === 'products') {
        root.querySelector('#heading').textContent = 'Enquire about a design';
        root.querySelectorAll('.product-only').forEach(el => { el.hidden = false; });
        root.querySelector('.standard-item').hidden = true;
        root.querySelector('.standard-timing').hidden = true;
        root.querySelector('.standard-invoice').hidden = true;
        itemInput.required = false;
        itemInput.disabled = true;
        productSelect.required = true;
        const designs = [...document.querySelectorAll('#winter-capsule .capsule-item')];
        for (const card of designs) {
          const title = card.querySelector('h3')?.textContent?.trim();
          const priceText = card.querySelector('.capsule-price')?.textContent || '';
          const match = priceText.match(/£\\s*(\\d+(?:\\.\\d{1,2})?)/);
          if (!title || !match) continue;
          const amount = Number(match[1]);
          priceMap.set(title, amount);
          const opt = document.createElement('option');
          opt.value = title;
          opt.textContent = title + ' — £' + amount.toFixed(2) + ' proposed';
          productSelect.append(opt);
        }
        const updatePrice = () => {
          const amount = priceMap.get(productSelect.value);
          if (amount === undefined) {
            priceLabel.textContent = 'Select a design';
            return;
          }
          const quantity = Number(form.elements.namedItem('quantity').value) || 1;
          priceLabel.textContent = '£' + amount.toFixed(2) + ' each · indicative total £' + (amount * quantity).toFixed(2);
        };
        productSelect.addEventListener('change', updatePrice);
        form.elements.namedItem('quantity').addEventListener('input', updatePrice);
        updatePrice();
      } else {
        root.querySelector('#heading').textContent = page === 'books' ? 'Enquire about a publication' : 'Request a service quote';
        productSelect.disabled = true;
      }
      const live = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint);
      const submit = form.querySelector('button[type="submit"]');
      submit.textContent = live ? 'Send enquiry securely' : 'Form unavailable';
      root.querySelector('.delivery-description').textContent = !live ? 'Enquiries are temporarily unavailable; please use the professional contact link.' : page === 'products' ? 'Explore proposed prices and ask about a specific design. These are not stocked items or confirmed retail offers, and no payment will be taken.' : 'Send your requirements securely. We will confirm scope, availability and an agreed price before any invoice or payment.';
      const makeReference = () => {
        const bytes = crypto.getRandomValues(new Uint8Array(8));
        return `MG-${prefix}-${Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('').toUpperCase()}`;
      };
      form.addEventListener('submit', async event => {
        event.preventDefault();
        for (const key of page === 'products' ? ['name'] : ['name', 'item']) {
          form.elements.namedItem(key).setCustomValidity(form.elements.namedItem(key).value.trim() ? '' : 'Please enter a value.');
        }
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const clean = key => String(data.get(key) || '').trim();
        reference ||= makeReference();
        const selectedItem = page === 'products' ? clean('product_selection') : clean('item');
        const proposedUnitPrice = page === 'products' ? priceMap.get(selectedItem) : undefined;
        body = [
          'Manifold Grace enquiry / quote request',
          `Reference: ${reference}`, `Page: ${page}`,
          `Name: ${clean('name')}`, `Reply email: ${clean('email')}`,
          `Item / service: ${selectedItem}`, `Quantity: ${clean('quantity')}`,
          ...(page === 'products' ?
            [`Proposed unit price: £${proposedUnitPrice.toFixed(2)} (not a confirmed retail price)`,
             `Indicative total: £${(proposedUnitPrice * Number(clean('quantity'))).toFixed(2)} (subject to confirmation)`] :
            [`Preferred timeframe: ${clean('timing') || 'Not specified'}`,
             `Invoice by email requested: ${data.get('invoice') ? 'Yes' : 'No'}`]),
          `Additional details: ${clean('message') || 'Not specified'}`,
          'Permission to respond: Yes',
          '', 'Please confirm price, availability and delivery terms before any purchase.',
          'This is an enquiry only. No order or payment has been made.'
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
        if (!live) {
          summary.hidden = false;
          summary.scrollIntoView({block:'nearest'});
          return;
        }
        summary.hidden = true;
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
        outgoing.set('invoice', page === 'products' ? 'Not applicable — design enquiry' : (data.get('invoice') ? 'Yes' : 'No'));
        if (page === 'products') {
          outgoing.set('item', selectedItem);
          outgoing.set('price_status', 'Proposed only — not a sale');
          outgoing.set('proposed_unit_price_gbp', proposedUnitPrice.toFixed(2));
          outgoing.set('indicative_total_gbp', (proposedUnitPrice * Number(clean('quantity'))).toFixed(2));
        }
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: outgoing,
            headers: { 'Accept': 'application/json' }
          });
          if (!response.ok) {
            summary.hidden = false;
            status.textContent = response.status === 429 ?
              'The form provider is receiving too many requests. Please try again later; delivery is not confirmed.' :
              'The provider did not accept this enquiry. Nothing is confirmed. Please retry or copy your request.';
            return;
          }
          // The owner has verified real Formspree notifications arriving in Gmail.
          // Keep customer-facing confirmation compact; detailed copies remain in Formspree/Gmail.
          form.hidden = true;
          summary.hidden = true;
          confirmation.querySelector('.sent-reference').textContent = 'Reference: ' + reference;
          confirmation.hidden = false;
          confirmation.scrollIntoView({block:'nearest'});
          submit.textContent = 'Enquiry submitted';
          return;
        } catch (error) {
          summary.hidden = false;
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
      root.querySelector('.new-enquiry').addEventListener('click', () => {
        form.reset();
        reference = '';
        body = '';
        form.hidden = false;
        summary.hidden = true;
        confirmation.hidden = true;
        submit.disabled = false;
        submit.textContent = 'Send enquiry securely';
        form.elements.namedItem('name').focus();
      });
      root.querySelector('.edit').addEventListener('click', () => {
        summary.hidden = true;
        (page === 'products' ? productSelect : itemInput).focus();
      });
      this.addEventListener('mg-select-item', event => {
        const title = String(event.detail?.title || '').slice(0,160);
        if (page === 'products') {
          if (priceMap.has(title)) {
            productSelect.value = title;
            productSelect.dispatchEvent(new Event('change'));
          }
          productSelect.focus();
        } else {
          itemInput.value = title;
          itemInput.focus();
        }
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
