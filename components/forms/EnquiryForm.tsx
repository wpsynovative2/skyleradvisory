"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { CircleCheckBig, TriangleAlert } from "lucide-react";
import contact from "@/data/contact.json";
import Loader from "@/components/ui/Loader";
import type { EnquiryResponse, FormFieldConfig } from "@/lib/types";

const fields = contact.fields as FormFieldConfig[];

type Status = "idle" | "submitting" | "success" | "error";

const inputBase =
  "w-full rounded-lg border border-line-soft bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-navy/15 disabled:cursor-not-allowed disabled:bg-black/[0.03]";

export default function EnquiryForm({ source = "Contact Section" }: { source?: string }) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot — bots fill hidden fields, humans never see them.
    if (String(formData.get("company") ?? "").trim() !== "") {
      setStatus("success");
      setFeedback(contact.successMessage);
      form.reset();
      return;
    }

    const payload: Record<string, unknown> = {
      source,
      pageUrl: typeof window === "undefined" ? "" : window.location.href,
      submittedAt: new Date().toISOString(),
      consent: formData.get("consent") === "on",
    };

    fields.forEach((field) => {
      payload[field.name] = String(formData.get(field.name) ?? "").trim();
    });

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: EnquiryResponse = await response.json();

      if (response.ok && result.ok) {
        setStatus("success");
        setFeedback(result.message || contact.successMessage);
        form.reset();
      } else {
        setStatus("error");
        setFeedback(result.message || contact.errorMessage);
      }
    } catch {
      setStatus("error");
      setFeedback(contact.errorMessage);
    }
  }

  const disabled = status === "submitting";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <CircleCheckBig className="text-emerald-600" size={44} />
        <p className="font-display text-xl text-navy">Enquiry received</p>
        <p className="max-w-sm text-sm leading-relaxed text-body">{feedback}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFeedback("");
          }}
          className="mt-2 text-sm font-semibold text-navy underline underline-offset-4 hover:text-orange"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${uid}-${field.name}`;
          const spansFull = field.type === "textarea" || field.name === "location";

          return (
            <div key={field.name} className={spansFull ? "sm:col-span-2" : ""}>
              <label
                htmlFor={id}
                className="mb-2 block font-sans text-[14px] text-body"
              >
                {field.label}
                {field.required ? <span className="ml-1 text-orange">*</span> : null}
              </label>

              {field.type === "select" ? (
                <select
                  id={id}
                  name={field.name}
                  required={field.required}
                  disabled={disabled}
                  defaultValue=""
                  className={inputBase}
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  rows={field.rows ?? 3}
                  required={field.required}
                  disabled={disabled}
                  placeholder={field.placeholder}
                  className={`${inputBase} resize-y`}
                />
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  disabled={disabled}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  inputMode={field.type === "tel" ? "tel" : undefined}
                  className={inputBase}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot: off-screen, ignored by humans and assistive tech. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-body">
        <input
          type="checkbox"
          name="consent"
          required
          disabled={disabled}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-navy)]"
        />
        <span>{contact.consentLabel}</span>
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-navy px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-orange disabled:cursor-not-allowed disabled:opacity-80"
      >
        {disabled ? (
          <>
            <Loader size={22} variant="light" label={contact.submittingLabel} />
            {contact.submittingLabel}
          </>
        ) : (
          contact.submitLabel
        )}
      </button>

      {status === "error" && feedback ? (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
          <TriangleAlert size={16} className="mt-px shrink-0" />
          {feedback}
        </p>
      ) : null}

      <p className="text-[11px] leading-relaxed text-muted">
        We respect your privacy. Your information will only be used for property inquiries. By
        submitting this form, you agree to our{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-navy">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms-and-conditions" className="underline underline-offset-2 hover:text-navy">
          Terms &amp; Conditions
        </Link>
        .
      </p>
    </form>
  );
}
