import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import site from "@/data/site.json";
import footer from "@/data/footer.json";
import { brandIcons } from "@/components/ui/Icon";

const contactIcons = { phone: Phone, mail: Mail, "map-pin": MapPin } as const;

/** Heading with the short accent rule used on every footer column. */
function ColumnTitle({ children, rule = "orange" }: { children: React.ReactNode; rule?: "orange" | "white" }) {
  return (
    <h2 className="font-card text-[22px] font-bold text-white sm:text-[25px]">
      <span
        className={`inline-block border-b-2 pb-2 ${
          rule === "orange" ? "border-orange" : "border-white"
        }`}
      >
        {children}
      </span>
    </h2>
  );
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src={footer.background} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-navy-deep/45" />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <h2 className="font-card text-[22px] font-bold sm:text-[25px]">
              <span className="inline-block border-b-2 border-orange pb-2">
                <span className="text-white">{footer.brand.lead} </span>
                <span className="text-orange">{footer.brand.accent}</span>
              </span>
            </h2>

            <p className="mt-5 max-w-[380px] font-sans text-[14px] leading-[1.8] text-white/80">
              {footer.about}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {footer.socials.map((social) => {
                const Glyph = brandIcons[social.icon as keyof typeof brandIcons];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={social.name}
                    className="grid h-11 w-11 place-items-center rounded-md bg-white/10 text-white transition hover:bg-orange"
                  >
                    {Glyph ? <Glyph size={20} /> : null}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <ColumnTitle rule="white">{footer.quickLinksTitle}</ColumnTitle>
            <ul className="mt-6 space-y-3">
              {footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-[13px] font-medium uppercase tracking-[0.04em] text-white/85 transition hover:pl-1 hover:text-orange"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <ColumnTitle>{footer.servicesTitle}</ColumnTitle>
            <ul className="mt-5">
              {footer.services.map((service, index) => (
                <li
                  key={service.label}
                  className={index < footer.services.length - 1 ? "border-b border-white/15" : ""}
                >
                  <a
                    href={service.href}
                    className="flex items-start gap-3 py-3 font-sans text-[14px] text-white/85 transition hover:text-orange"
                  >
                    <ArrowRight size={14} className="mt-1 shrink-0 text-orange" />
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="lg:col-span-3">
            <ColumnTitle>{footer.getInTouchTitle}</ColumnTitle>
            <ul className="mt-6 space-y-5">
              {footer.contacts.map((item) => {
                const Glyph = contactIcons[item.icon as keyof typeof contactIcons] ?? Phone;
                const body = (
                  <>
                    <Glyph size={18} className="mt-0.5 shrink-0 text-white" />
                    <span>
                      <span className="block font-sans text-[16px] font-semibold text-white sm:text-[18px]">
                        {item.value}
                      </span>
                      <span className="mt-0.5 block font-sans text-[13px] leading-[1.6] text-white/70">
                        {item.caption}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={item.value}>
                    {item.href ? (
                      <a href={item.href} className="flex gap-3 transition hover:text-orange">
                        {body}
                      </a>
                    ) : (
                      <div className="flex gap-3">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Disclaimer panel */}
        <div className="mt-12 rounded-md border border-white/20 bg-white/[0.04] px-6 py-5">
          <p className="font-sans text-[12px] leading-[1.8] text-white/75">{footer.disclaimer}</p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/15 pt-6 lg:flex-row lg:justify-between">
          <p className="font-sans text-[13px] text-white/80">
            &copy; {site.copyrightYear} {site.legalName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {site.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[13px] text-white/85 transition hover:text-orange"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href={site.credit.url}
            target="_blank"
            rel="noreferrer"
            className="border-b border-white/60 pb-1 font-sans text-[13px] text-white transition hover:border-orange hover:text-orange"
          >
            {site.credit.label} {site.credit.name}
          </a>
        </div>
      </div>
    </footer>
  );
}
