/**
 * Google reCAPTCHA v3 — shared pieces.
 *
 * v3 is invisible: there is no checkbox and nothing for the visitor to solve.
 * The script watches the session, `executeRecaptcha` mints a short-lived token
 * on submit, and the server exchanges that token with Google for a score
 * between 0.0 (almost certainly a bot) and 1.0 (almost certainly a human).
 * See the verification side in `app/api/enquiry/route.ts`.
 *
 * Both keys are optional. With no site key the helper returns an empty token
 * and the form behaves exactly as it did before, so the site still runs on a
 * machine — or a fresh deployment — that has no keys yet.
 */

/** Public key, inlined into the browser bundle at build time. */
export const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export const recaptchaEnabled = recaptchaSiteKey !== "";

export const RECAPTCHA_SCRIPT_SRC = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;

/** Sent with the token and checked server-side, so a token minted elsewhere is rejected. */
export const RECAPTCHA_ACTION = "enquiry_submit";

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

/* The enquiry modal can open on a page before api.js has finished loading, so
   wait for the global rather than assuming it is there. */
const POLL_INTERVAL_MS = 100;
const LOAD_TIMEOUT_MS = 10_000;

function waitForGrecaptcha(): Promise<Grecaptcha> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha?.ready) {
      resolve(window.grecaptcha);
      return;
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (window.grecaptcha?.ready) {
        window.clearInterval(timer);
        resolve(window.grecaptcha);
      } else if (Date.now() - startedAt > LOAD_TIMEOUT_MS) {
        window.clearInterval(timer);
        reject(new Error("reCAPTCHA failed to load"));
      }
    }, POLL_INTERVAL_MS);
  });
}

/**
 * Returns a fresh reCAPTCHA token for `action`, or an empty string when
 * reCAPTCHA is not configured. Throws if the script never loads — an ad
 * blocker, an offline visitor, or a network that blocks google.com.
 */
export async function executeRecaptcha(action: string = RECAPTCHA_ACTION): Promise<string> {
  if (!recaptchaEnabled || typeof window === "undefined") return "";

  const grecaptcha = await waitForGrecaptcha();

  return new Promise<string>((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(recaptchaSiteKey, { action }).then(resolve, reject);
    });
  });
}
