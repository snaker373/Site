# Web3Forms production check

The form uses the Web3Forms browser endpoint with JSON, a hidden `botcheck`
field, a minimum completion time and a local rate limit of three successful
submissions per ten minutes.

Before the public deployment:

1. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the hosting environment.
2. In Web3Forms form settings, add `saarmontage.de,www.saarmontage.de` under
   **Restrict to Domain** if the account plan includes that feature.
3. Send one production test from the domain and confirm delivery to
   `info@saarmontage.de`.
4. If spam persists, enable Cloudflare Turnstile or reCAPTCHA in Web3Forms.

Domain restriction is managed by Web3Forms and cannot be verified from this
static repository alone.
