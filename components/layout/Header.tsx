"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import site from "@/data/site.json";
import { useEnquiryModal } from "@/components/ui/EnquiryModalProvider";

/**
 * Sticky white header, 86px tall, matching the original: logo left,
 * uppercase nav centred, "Enquire Now" pill on the right.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const { open } = useEnquiryModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const sections = site.nav
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[120] transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-white shadow-[0_2px_18px_rgba(2,1,1,0.06)]"
          : "bg-white/[0.14] backdrop-blur-[2px]"
      }`}
    >
      <div className="mx-auto flex h-[86px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={site.name} className="relative z-10 shrink-0">
          <Image
            src={site.logo}
            alt={`${site.name} logo`}
            width={220}
            height={64}
            preload
            className="h-[54px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {site.nav.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative py-1 font-sans text-[13px] font-medium uppercase tracking-[0.04em] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-navy after:transition-all after:duration-300 ${
                  isActive
                    ? "text-navy after:w-full"
                    : `after:w-0 hover:text-navy hover:after:w-full ${scrolled ? "text-body" : "text-navy"}`
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => open("Header")}
            className="hidden items-center gap-2 rounded-md bg-navy px-6 py-3 font-sans text-[14px] font-semibold text-white transition hover:bg-orange sm:inline-flex"
          >
            {site.cta.label}
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative z-10 grid h-11 w-11 place-items-center rounded-md border border-line text-navy transition hover:border-navy xl:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-[86px] bottom-0 z-0 bg-white transition-all duration-300 xl:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col overflow-y-auto px-6 py-6" aria-label="Mobile">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line/70 py-4 font-sans text-sm font-medium uppercase tracking-wide text-body transition hover:pl-2 hover:text-navy"
            >
              {item.label}
            </a>
          ))}

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              open("Mobile menu");
            }}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3.5 font-sans text-sm font-semibold text-white"
          >
            {site.cta.label}
            <ArrowRight size={15} />
          </button>

          <div className="mt-8 space-y-1.5 font-sans text-sm text-slate">
            {site.contact.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="block hover:text-navy">
                {phone}
              </a>
            ))}
            {site.contact.emails.map((email) => (
              <a key={email} href={`mailto:${email}`} className="block hover:text-navy">
                {email}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
