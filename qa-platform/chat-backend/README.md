# Private AI chat — runnable wiring, pending provider connection

## Purpose
Minimal text input → authenticated Cloudflare Worker → OpenRouter hosted free chat model → text output in AI Assurance Studio. This uses an existing model **without training** and does not claim to run on a public URL until Cloudflare and authentication have been configured.

## Provider and infrastructure
- Create a free OpenRouter account: https://openrouter.ai/
- Create API key: https://openrouter.ai/settings/keys
- Free chat routing: `openrouter/free`; free availability and usage quotas may change.
- Deploy a Cloudflare Worker: https://dash.cloudflare.com/
- Cloudflare free Worker allowances are independent of provider model limits.
- The Worker validates a signed-in, email-verified Supabase user by contacting the configured Supabase Auth API.
- It requires a Cloudflare KV namespace for an *approximate* user-level daily usage limit, to avoid unrestricted use of a shared API key.

## Setup, in order
1. Follow `../README.md` to configure Supabase authentication, private project database, email verification and valid redirect URLs. Confirm sign-up and sign-in work first.
2. Create a Cloudflare Workers project using this `worker.js` and `wrangler.toml`. Create a KV namespace and replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` with its actual ID.
3. Add the following **Worker secrets**, not GitHub files: `OPENROUTER_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`. Keep service-role keys out of this project.
4. Deploy the Worker with Wrangler or connect the GitHub repository through Cloudflare's Git integration using this directory as the project root. Authenticate to Cloudflare and permit the repo connection yourself.
5. Set `endpoint` in `../chat-config.js` to the deployed `https://...workers.dev` URL (without /chat). It is a public API URL, not an API secret.
6. In the product page, sign in and send a message. Confirm a response appears from OpenRouter and the API key never appears in browser source or network requests.
7. Test 401 without a token; 403 for unverified accounts and unexpected origins; 429 after quota; timeout behaviour; very long text rejection; browser accessibility; provider quota; retries and failures.
8. Keep the endpoint private to verified users during testing; do not invite public traffic before abuse prevention and privacy assessment.

## Not yet done
No Cloudflare account has been connected. No provider account or API key has been created, and no Worker has been deployed. The remote model has **not** been called. Without configuration, the chat input is disabled rather than silently simulating a reply.

## Security limits
The current KV counter is **not atomic**: parallel requests may exceed its limit. Use a Durable Object or another atomic rate limiter before public launch. OpenRouter routes to third-party model providers; read their data policies and do not send confidential research, personal records or API secrets as prompts. This is a minimal authenticated proof of concept, not a production-hardened chat service.
