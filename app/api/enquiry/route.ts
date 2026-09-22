import type { NextRequest } from "next/server";
import contact from "@/data/contact.json";
import site from "@/data/site.json";
import type { EnquiryResponse } from "@/lib/types";

/**
 * Receives enquiries from the site forms and relays them to the Google Apps
 * Script web app, which appends a row to the Google Sheet and sends the
 * notification emails. See `google-apps-script/Code.gs`.
 *
 * The script URL is kept server-side so the endpoint is never exposed to the
 * browser and cannot be spammed directly.
 */

const REQUIRED_FIELDS = ["name", "phone", "email"] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITS_ONLY = /\D/g;

function json(body: EnquiryResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request body.", code: "validation" }, 400);
  }

  const value = (key: string) => String(body[key] ?? "").trim();

  // --- Validation -----------------------------------------------------------
  for (const field of REQUIRED_FIELDS) {
    if (!value(field)) {
      return json(
        { ok: false, message: "Please fill in your name, phone number and email.", code: "validation" },
        400,
      );
    }
  }

  if (!EMAIL_PATTERN.test(value("email"))) {
    return json({ ok: false, message: "Please enter a valid email address.", code: "validation" }, 400);
  }

  const phoneDigits = value("phone").replace(DIGITS_ONLY, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return json({ ok: false, message: "Please enter a valid phone number.", code: "validation" }, 400);
  }

  if (body.consent !== true) {
    return json(
      { ok: false, message: "Please accept the consent checkbox to continue.", code: "validation" },
      400,
    );
  }

  // --- Payload --------------------------------------------------------------
  const record = {
    submittedAt: value("submittedAt") || new Date().toISOString(),
    name: value("name"),
    phone: value("phone"),
    email: value("email"),
    requirement: value("requirement"),
    projectType: value("projectType"),
    location: value("location"),
    message: value("message"),
    consent: body.consent === true ? "Yes" : "No",
    source: value("source") || "Website",
    pageUrl: value("pageUrl"),
    userAgent: request.headers.get("user-agent") ?? "",
  };

  const endpoint = process.env.GOOGLE_SCRIPT_URL;

  if (!endpoint) {
    // Without the endpoint the submission cannot be delivered. Log it so it is
    // recoverable from server logs, and tell the visitor honestly.
    console.error("[enquiry] GOOGLE_SCRIPT_URL is not set. Submission not delivered:", record);
    return json(
      {
        ok: false,
        message: `The enquiry form is not connected yet. Please call us on ${site.contact.phones[0]} or email ${site.contact.emails[0]}.`,
        code: "not_configured",
      },
      503,
    );
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...record, token: process.env.GOOGLE_SCRIPT_TOKEN ?? "" }),
      // Apps Script answers with a 302 to script.googleusercontent.com.
      redirect: "follow",
      cache: "no-store",
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      console.error("[enquiry] Apps Script returned", upstream.status, text.slice(0, 500));
      return json({ ok: false, message: contact.errorMessage, code: "upstream" }, 502);
    }

    // Apps Script returns JSON when deployed from Code.gs; tolerate plain text.
    let result: { ok?: boolean; message?: string } = {};
    try {
      result = JSON.parse(text);
    } catch {
      result = { ok: true };
    }

    if (result.ok === false) {
      console.error("[enquiry] Apps Script rejected the submission:", result.message);
      return json({ ok: false, message: contact.errorMessage, code: "upstream" }, 502);
    }

    return json({ ok: true, message: contact.successMessage }, 200);
  } catch (error) {
    console.error("[enquiry] Failed to reach Apps Script:", error);
    return json({ ok: false, message: contact.errorMessage, code: "server" }, 502);
  }
}
