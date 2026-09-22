"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import legal from "@/data/legal.json";

const STORAGE_KEY = "skyler-disclaimer-ack";

/**
 * The property disclaimer the original site shows on arrival. Acknowledgement
 * is remembered per browser, so returning visitors are not asked again.
 */
export default function DisclaimerGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let acknowledged = false;
    try {
      acknowledged = window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // Private mode / blocked storage — show the notice, do not trap the user.
    }

    if (acknowledged) return;

    // Let the preloader clear first.
    const timer = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  const acknowledge = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore — acknowledgement simply will not persist.
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={legal.disclaimer.title}
      className="fixed inset-0 z-[180] flex items-end justify-center bg-ink/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="bg-navy px-6 py-5 sm:px-9">
          <p className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-orange">
            {legal.disclaimer.title}
          </p>
          <h2 className="mt-2 font-display text-xl text-white sm:text-2xl">
            {legal.disclaimer.heading}
          </h2>
        </div>

        <div className="space-y-4 px-6 py-6 sm:px-9">
          {legal.disclaimer.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-[13px] leading-relaxed text-slate">
              {paragraph}
            </p>
          ))}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/disclaimer"
              className="text-xs font-semibold text-navy underline underline-offset-4 hover:text-orange"
            >
              Read the full disclaimer
            </Link>

            <button
              type="button"
              onClick={acknowledge}
              className="rounded-full bg-navy px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-orange"
            >
              {legal.disclaimer.acceptLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
