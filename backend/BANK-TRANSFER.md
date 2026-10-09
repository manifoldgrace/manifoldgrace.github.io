# Bank-transfer enquiries

Enquiry components are installed only on `services.html`, `my-book.html` and `products.html`. They do not take payment or connect to a bank. No paid service is required by this interim component.

## Enable enquiries

Put the owner-approved public business enquiry email in `assets/bank-request-config.js`. The email is visible in public code. No account-login email has been reused automatically. With no inbox configured the page clearly states that nothing was sent and offers a copyable request.

With an inbox configured the customer reviews their request and opens their email app, where they must press Send. The website cannot confirm delivery. Automatic form delivery remains a separate server-side setup if desired later.

## Handling

Review the request, agree scope and price, send bank-transfer instructions privately and issue an invoice if requested. Use the request reference in the invoice and payment instruction. Verify receipt from your own bank record before confirming payment or fulfilling an order. Books and merchandise remain enquiries until availability is confirmed.

Bank instructions need the payee name, sort code, account number, amount and reference. Keep these out of the public code; use an appropriate account under its provider's terms. Credentials, PINs and security codes never belong in a request or invoice.

## Test after email setup

Submit an enquiry from a second email address, request an invoice, send the generated message, check receipt and reply routing, then issue a test invoice without requiring a payment. No real payment or live email delivery was tested during integration.
