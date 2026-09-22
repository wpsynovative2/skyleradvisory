"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowUp, FileText, Phone } from "lucide-react";
import site from "@/data/site.json";
import Modal from "@/components/ui/Modal";
import { WhatsAppIcon } from "@/components/ui/Icon";

type Action = {
  key: string;
  label: string;
  title: string;
  icon: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
};

/**
 * Quick actions, matching the original at both sizes:
 *  - lg and up: a vertical rail of circular buttons on the right
 *  - below lg: a full-width fixed bottom bar with labelled icons, so it never
 *    covers body copy the way a floating rail does on a narrow screen
 */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const actions: Action[] = [
    {
      key: "whatsapp",
      label: "WHATSAPP",
      title: "Whatsapp",
      icon: <WhatsAppIcon size={22} />,
      href: site.contact.whatsappUrl,
      external: true,
    },
    {
      key: "brochure",
      label: "BROCHURE",
      title: "Brochure",
      icon: <FileText size={21} />,
      onClick: () => setBrochureOpen(true),
    },
    {
      key: "call",
      label: "CALL US",
      title: "Call us",
      icon: <Phone size={21} />,
      href: `tel:${site.contact.phones[0].replace(/\s/g, "")}`,
    },
  ];

  return (
    <>
      {/* Desktop: vertical rail */}
      <div className="fixed bottom-7 right-6 z-[110] hidden flex-col items-center gap-3 lg:flex">
        {actions.map((action) =>
          action.href ? (
            <a
              key={action.key}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              aria-label={action.title}
              title={action.title}
              className={`grid h-12 w-12 place-items-center rounded-full bg-navy text-amber shadow-lg transition hover:bg-amber hover:text-white ${
                action.key === "whatsapp" ? "animate-pulse-ring" : ""
              }`}
            >
              {action.icon}
            </a>
          ) : (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              aria-label={action.title}
              title={action.title}
              className="grid h-12 w-12 place-items-center rounded-full bg-navy text-amber shadow-lg transition hover:bg-amber hover:text-white"
            >
              {action.icon}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={`grid h-12 w-12 place-items-center rounded-full border border-navy/15 bg-white text-navy shadow-lg transition-all hover:bg-navy hover:text-white ${
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <ArrowUp size={20} />
        </button>
      </div>

      {/* Mobile: full-width action bar */}
      <div className="fixed inset-x-0 bottom-0 z-[110] grid grid-cols-3 bg-navy shadow-[0_-4px_20px_rgba(2,1,1,0.25)] lg:hidden">
        {actions.map((action) => {
          const inner = (
            <>
              <span className="text-white">{action.icon}</span>
              <span className="font-sans text-[12px] font-medium tracking-[0.06em] text-amber">
                {action.label}
              </span>
            </>
          );

          return action.href ? (
            <a
              key={action.key}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              aria-label={action.title}
              className="flex flex-col items-center justify-center gap-1.5 py-3.5 transition active:bg-white/10"
            >
              {inner}
            </a>
          ) : (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              aria-label={action.title}
              className="flex flex-col items-center justify-center gap-1.5 py-3.5 transition active:bg-white/10"
            >
              {inner}
            </button>
          );
        })}
      </div>

      <Modal open={brochureOpen} onClose={() => setBrochureOpen(false)} title="Brochure">
        <div className="px-7 py-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy/5 text-navy">
            <FileText size={28} />
          </div>
          <h2 className="mt-5 font-display text-[26px] font-semibold text-navy">
            Download our brochure
          </h2>
          <p className="mx-auto mt-3 max-w-sm font-sans text-[14px] leading-relaxed text-body">
            Get an overview of {site.name} — our mandates, services, market presence, and track
            record across Mumbai.
          </p>
          <a
            href={site.brochure}
            download
            onClick={() => setBrochureOpen(false)}
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-navy px-8 py-3.5 font-sans text-[14px] font-semibold text-white transition hover:bg-orange"
          >
            <FileText size={16} />
            Download PDF
          </a>
        </div>
      </Modal>
    </>
  );
}
