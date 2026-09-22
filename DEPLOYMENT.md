# Deploying Skyler Advisory

## Read this first

This site is a **Next.js 16 application, not a folder of HTML files.** There is
no `index.html` to drop into `public_html`.

It needs a server that can run **Node.js 20.9 or newer** as a long-running
process, because two things happen on the server at request time:

- `/api/enquiry` — receives the contact form, validates it, verifies reCAPTCHA
  and forwards it to Google Apps Script. The Apps Script URL and the reCAPTCHA
  secret are deliberately kept server-side.
- `next/image` — resizes and converts images to WebP/AVIF on demand.

Plain shared hosting that only serves static files (a basic cPanel plan with no
Node support) **will not run this site.** If that is all that is available, see
[If the server cannot run Node](#if-the-server-cannot-run-node) at the bottom.

---

## What to hand over

Pick one of the two options below.

### Option A — hand over the source (recommended)

Give the client the project repository (everything except `node_modules`,
`.next` and `.env.local`) and let their server build it. This is the normal way
to deploy Next.js and the easiest to update later.

```bash
npm ci
npm run build
npm start            # serves on port 3000
```

Zip for handover, if they are not using git:

```bash
git archive --format=zip -o skyleradvisory-source.zip HEAD
```

`git archive` exports exactly the committed files, so build artefacts and
secrets are excluded automatically.

### Option B — hand over a prebuilt bundle

Use this when the client's server should not run `npm install`. It produces a
self-contained folder with its own trimmed `node_modules` and a `server.js`.

1. Add one line to `next.config.ts`:

   ```ts
   const nextConfig: NextConfig = {
     output: "standalone",
     // ...existing config
   };
   ```

2. Build, then assemble the bundle — the standalone output deliberately leaves
   out `public/` and `.next/static/`, so they are copied in by hand:

   ```bash
   npm ci
   npm run build
   cp -r public .next/standalone/
   cp -r .next/static .next/standalone/.next/
   ```

3. Zip `.next/standalone/` and send that. On their server:

   ```bash
   node server.js       # PORT and HOSTNAME env vars are respected
   ```

**The catch with Option B:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is compiled into
the JavaScript at build time. Whoever runs `npm run build` must already have the
final site key, registered for the client's live domain. Changing it later means
a new build — setting it on their server does nothing.

---

## Environment variables

Create `.env.local` in the application root on the server (or set these in the
hosting panel / systemd unit). None of these are in the repository.

| Variable | Required | Set at | Purpose |
| --- | --- | --- | --- |
| `GOOGLE_SCRIPT_URL` | Yes | runtime | Apps Script `/exec` URL that writes the Google Sheet and sends the emails |
| `GOOGLE_SCRIPT_TOKEN` | Recommended | runtime | Shared secret matching the `TOKEN` script property in Apps Script |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Optional | **build** | Public reCAPTCHA v3 key |
| `RECAPTCHA_SECRET_KEY` | Optional | runtime | Private reCAPTCHA v3 key |
| `RECAPTCHA_MIN_SCORE` | Optional | runtime | Score threshold, defaults to `0.5` |

See [`.env.example`](./.env.example) for the annotated template,
[`google-apps-script/README.md`](./google-apps-script/README.md) for the Sheet
and email setup, and the Spam protection section of [`README.md`](./README.md)
for reCAPTCHA.

**Before go-live:** the reCAPTCHA keys must be registered for the live domain at
<https://www.google.com/recaptcha/admin>. A key registered only for `localhost`
scores every real visitor as a bot on the live site.

---

## Running it in production

Next.js listens on a port; it does not replace nginx or Apache. Put a reverse
proxy in front of it — it handles TLS, compression and malformed requests, and
Next.js is not designed to face the internet directly.

Keep the process alive with pm2, systemd or Docker:

```bash
npm install -g pm2
pm2 start npm --name skyleradvisory -- start
pm2 save && pm2 startup
```

nginx:

```nginx
server {
    listen 443 ssl;
    server_name skyleradvisory.com www.skyleradvisory.com;

    # ssl_certificate / ssl_certificate_key ...

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
    }
}
```

`X-Forwarded-For` matters: the enquiry route passes the visitor's IP to Google
when scoring the reCAPTCHA token. Without it every enquiry appears to come from
the server itself.

### Go-live checklist

- [ ] Node 20.9+ on the server (`node -v`)
- [ ] `.env.local` present with the Apps Script URL and token
- [ ] reCAPTCHA keys registered for the live domain, site key used at build time
- [ ] `npm run build` completed without errors
- [ ] Process manager restarts the app on reboot
- [ ] Reverse proxy terminating TLS and forwarding `X-Forwarded-For`
- [ ] Test enquiry submitted — row appears in the Sheet, both emails arrive
- [ ] `site.url` in `data/site.json` matches the live domain (sitemap, OG tags)

### Updating later

```bash
git pull            # or unzip the new source over the old one
npm ci
npm run build
pm2 restart skyleradvisory
```

Content-only edits are just `data/*.json` — but a rebuild is still required,
since the pages are prerendered at build time.

---

## If the server cannot run Node

A static export (`output: "export"`) is possible, but it **removes the API
route**, so the enquiry form would have to post straight to the Apps Script URL
from the browser. That exposes the endpoint publicly, invites spam, and means
the reCAPTCHA check can no longer be enforced server-side.

Better options, in order:

1. Add Node support to the current host (most VPS and cloud panels offer it).
2. Keep the site on a platform that runs Next.js natively — Vercel, Netlify or
   similar — and point the client's domain at it.
3. Static export only as a last resort, accepting the loss of form security and
   on-demand image optimisation.
