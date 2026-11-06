/* Public settings: visible in the website source.
   A Formspree endpoint ID is PUBLIC, but the account's receiving Gmail remains private.
   Obtain a real endpoint from a Formspree form linked to the private mailbox.
   Leave it blank until verified. NEVER add passwords, mail credentials or API secrets. */
window.MG_BANK_REQUEST = Object.freeze({
  enquiryEmail: '',
  formspreeEndpoint: '',
  businessName: 'Manifold Grace'
});
