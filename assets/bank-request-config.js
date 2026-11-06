/* Public settings: visible in the website source.
   A Formspree endpoint ID is PUBLIC, but the account's receiving Gmail remains private.
   Obtain a real endpoint from a Formspree form linked to the private mailbox.
   This public submission endpoint is supplied by the site owner. Receipt in Gmail remains unverified until a live test. NEVER add passwords, mail credentials or API secrets. */
window.MG_BANK_REQUEST = Object.freeze({
  enquiryEmail: '',
  formspreeEndpoint: 'https://formspree.io/f/xoeebzbg',
  businessName: 'Manifold Grace'
});
