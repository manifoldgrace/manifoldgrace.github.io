# Google Firebase AI Logic → Gemini → chat window

## Current status
The chat page and actual Firebase SDK request/response code have been committed to GitHub. **Live model execution is unverified and remains disabled until you create and configure a Firebase project.** This deliberately avoids committing a private API key or advertising simulated answers.

## Google setup (no paid account needed for supported free-tier models)
1. Visit https://console.firebase.google.com/ and create a Firebase project. Select no-cost Spark where eligible.
2. In Firebase: AI Services → AI Logic → Get Started → Gemini Developer API (not the paid Agent Platform API).
3. Register a **Web** app for the existing GitHub Pages website. Copy the public Firebase web config fields (`apiKey`, `projectId`, `appId`, optional `authDomain`). These are client configuration identifiers; do **not** add Gemini API secrets or service-account keys.
4. Under Firebase Security → App Check, register the web app with **reCAPTCHA Enterprise**, configure the domain `manifoldgrace.github.io`, obtain the public reCAPTCHA Enterprise site key, and enforce App Check for Firebase AI Logic. App Check enforcement has been required since November 2, 2026.
5. Edit `qa-platform/firebase-chat-config.js` via GitHub and fill only the public Firebase config and reCAPTCHA Enterprise **site** key. Choose a model confirmed to be available on your project's free tier; the example is `gemini-2.5-flash-lite`.
6. Open `https://manifoldgrace.github.io/qa-platform/chat.html`, type a simple question, and verify a real response. Check browser console if you see App Check or quota errors.
7. Before inviting public users, review quotas, abuse prevention, consent/privacy notices, error handling and user-access boundaries. App Check reduces abuse but does not replace user authentication or rate limiting.

## Implementation
- `chat.html`: minimal accessible chat UI with input and answer output.
- `firebase-chat-config.js`: safe **public** configuration placeholders. It is intentionally empty.
- `firebase-chat.js`: Firebase AI Logic SDK integration: initialise Firebase → App Check → Gemini Developer API → `startChat` → `sendMessage` → render response as **text**, not HTML. No local storage of user messages.
- `README.md`: broader QA product scaffold and account-registration roadmap.
- `qa-tests.json`: QA methodologies, **not** a trained model or a verified evaluation dataset.

## Distinctions
This connects to a Google-managed Gemini model. It does **not** train a proprietary model from scratch, add RAG or reading of your site's files, deploy a fine-tuned model, or provide persistent memory. These require separate components.
The Gemini API's free tier can use submitted content to improve Google's products. Do not send private or confidential research under that tier without reviewing the service terms. Never commit an unrestricted secret key into a static GitHub Pages repository.

Sources:
- https://firebase.google.com/docs/ai-logic/get-started?platform=web
- https://firebase.google.com/docs/ai-logic/chat
- https://firebase.google.com/docs/ai-logic/app-check
- https://firebase.google.com/docs/ai-logic/pricing
