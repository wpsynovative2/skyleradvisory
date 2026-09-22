import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

type LegalDocument = {
  title: string;
  heading: string;
  paragraphs: string[];
  points: { term: string; text: string }[];
  closing?: string;
};

export default function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <article className="bg-white pb-20 pt-[84px] lg:pb-28">
      <header className="bg-navy-deep px-4 py-16 text-white sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
          <h1 className="mt-6 font-display text-3xl sm:text-4xl lg:text-[2.75rem]">
            {document.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{document.heading}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        {document.paragraphs.length > 0 ? (
          <div className="space-y-5">
            {document.paragraphs.map((paragraph) => (
              <Reveal key={paragraph.slice(0, 40)}>
                <p className="text-sm leading-[1.85] text-slate">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        ) : null}

        {document.points.length > 0 ? (
          <ul className={`space-y-4 ${document.paragraphs.length > 0 ? "mt-8" : ""}`}>
            {document.points.map((point, index) => (
              <Reveal key={point.text.slice(0, 40)} delay={index * 60} as="li">
                <div className="flex gap-4 rounded-xl border border-line-soft bg-cream p-5">
                  <span className="font-display text-lg text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-slate">
                    {point.term ? (
                      <strong className="font-semibold text-navy">{point.term}: </strong>
                    ) : null}
                    {point.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        ) : null}

        {document.closing ? (
          <Reveal>
            <p className="mt-9 border-l-4 border-orange bg-cream px-6 py-5 text-sm font-medium leading-relaxed text-navy">
              {document.closing}
            </p>
          </Reveal>
        ) : null}
      </div>
    </article>
  );
}
