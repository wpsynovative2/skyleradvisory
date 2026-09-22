# Google Sheets + Email delivery setup

Every enquiry submitted on the site is posted to `/api/enquiry`, which forwards it
to a Google Apps Script web app. That script appends a row to your Google Sheet
and sends two emails: a notification to the team and an acknowledgement to the
person who enquired.

```
Browser form  →  /api/enquiry (Next.js, server-side)  →  Apps Script web app
                                                            ├─ Google Sheet row
                                                            ├─ Email to team
                                                            └─ Email to enquirer
```

The Apps Script URL lives in a server-side environment variable, so it is never
exposed in the browser and cannot be posted to directly by scrapers.

---

## 1. Create the Google Sheet

1. Go to <https://sheets.new> and create a spreadsheet, e.g. **Skyler Enquiries**.
2. Copy its ID from the address bar — the long string between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`1AbC...XyZ`**`/edit`

The header row is created automatically on the first submission, so there is
nothing else to set up here.

## 2. Create the Apps Script

1. Open <https://script.google.com> → **New project**.
2. Delete the placeholder code, then paste the entire contents of
   [`Code.gs`](./Code.gs).
3. Rename the project to **Skyler Enquiry Handler** and save.

## 3. Add the script properties

In the Apps Script editor: **Project Settings** (gear icon) → **Script Properties**
→ **Add script property**. Add these:

| Property               | Value                                              | Required |
| ---------------------- | -------------------------------------------------- | -------- |
| `SHEET_ID`             | The spreadsheet ID from step 1                      | Yes      |
| `SHEET_NAME`           | `Enquiries` (or any tab name you prefer)            | No       |
| `NOTIFY_EMAIL`         | Where notifications go. Comma-separate for several. | Yes      |
| `TOKEN`                | Any long random string — see step 5                 | Recommended |
| `SEND_ACKNOWLEDGEMENT` | `true` or `false`                                   | No       |

To generate a token, run this in a terminal (or just invent a long random string):

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

## 4. Deploy as a web app

1. **Deploy** → **New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. **Deploy**, then **Authorize access** and approve the permissions
   (Google will warn the app is unverified — this is normal for your own script;
   choose **Advanced** → **Go to Skyler Enquiry Handler**).
5. Copy the **Web app URL**. It ends in `/exec`.

> **Important:** every time you edit `Code.gs`, you must create a **new version**
> under Deploy → Manage deployments → Edit → Version: *New version*, otherwise the
> live URL keeps serving the old code.

## 5. Point the site at the script

Create a `.env.local` file in the project root (copy `.env.example`):

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
GOOGLE_SCRIPT_TOKEN=the-same-token-you-set-in-step-3
```

Restart `npm run dev` so the new variables are picked up.

When deploying to Vercel, Netlify or any other host, add these same two variables
in that platform's **Environment Variables** settings. `.env.local` is gitignored
and is never deployed.

## 6. Test it

- **From the Apps Script editor:** select the `testSubmission` function in the
  toolbar dropdown and click **Run**. A test row should appear in the Sheet and
  the emails should arrive.
- **From the site:** submit the contact form. You should see the success state,
  a new row in the Sheet, and both emails.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| "The enquiry form is not connected yet" | `GOOGLE_SCRIPT_URL` is missing | Add it to `.env.local` and restart the dev server |
| Form fails, server log shows `Unauthorized` | Token mismatch | `GOOGLE_SCRIPT_TOKEN` must exactly match the `TOKEN` script property |
| Rows appear but no emails | Gmail daily quota reached | Consumer Gmail allows ~100 emails/day; Workspace allows ~1,500 |
| Nothing happens after editing `Code.gs` | Deployment still on the old version | Deploy → Manage deployments → Edit → Version: **New version** |
| Apps Script returns HTML instead of JSON | "Who has access" is not `Anyone` | Re-deploy with access set to `Anyone` |

## Columns written to the Sheet

`Timestamp`, `Name`, `Phone`, `Email`, `Property Requirement`, `Project Type`,
`Preferred Location`, `Message`, `Consent`, `Source`, `Page URL`, `User Agent`

`Source` records which CTA opened the form (Hero, Header, a specific project
card, and so on), which is useful for seeing what drives enquiries.
