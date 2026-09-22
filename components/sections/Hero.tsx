import Image from "next/image";
import { ArrowRight } from "lucide-react";
import hero from "@/data/hero.json";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

export default function Hero() {
  return (
    <section id="home" className="relative isolate">
      {/* Full-bleed photograph, as on the original */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={hero.background}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* White wash from the left, matching the original's overlay */}
        <div className="absolute inset-0 hero-wash" />
      </div>

      <div className="mx-auto flex w-[min(100%,max(80%,1200px))] flex-col justify-center px-4 pb-14 pt-[130px] sm:px-6 lg:min-h-screen lg:pb-[220px]">
        <div className="max-w-[720px]">
          <Reveal>
            <p className="font-label text-[18px] font-extrabold uppercase tracking-[0.14em] text-orange sm:text-[21.6px]">
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-4 font-display text-[40px] font-bold leading-[1.12] text-navy sm:text-[52px] lg:text-[64.8px]">
              {hero.titleLines[0]}
              <br />
              {hero.titleLines[1]}
              <span className="text-orange">{hero.titleAccent}</span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            {/* The copy is authored as three lines for the desktop layout. On
                narrow screens those breaks land mid-sentence, so let it reflow
                there and only honour them from lg up. */}
            <p className="mt-5 font-sans text-[15px] leading-[1.8] text-body sm:text-base">
              {hero.description.map((line, index) => (
                <span key={line}>
                  {index > 0 ? " " : null}
                  <span className="lg:block">{line}</span>
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {hero.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`inline-flex items-center gap-2 rounded-md px-7 py-3.5 font-sans text-[14px] font-semibold transition ${
                    action.variant === "solid"
                      ? "bg-navy text-white hover:bg-orange"
                      : "border border-navy/25 bg-white text-navy hover:bg-navy hover:text-white"
                  }`}
                >
                  {action.label}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* The pillar bar overlays the bottom of the hero on desktop. On narrower
          screens it stacks into four rows, which is far taller than the space
          the hero reserves, so there it sits in normal flow instead. */}
      <div className="px-4 pb-10 sm:px-6 lg:absolute lg:inset-x-0 lg:bottom-8 lg:z-10 lg:pb-0">
        <div className="mx-auto w-[min(100%,max(80%,1200px))] rounded-[10px] bg-black/45 px-6 py-8 backdrop-blur-[2px] sm:px-8">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {hero.highlights.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <div className="flex items-start gap-4">
                  <Icon
                    name={item.icon}
                    size={34}
                    strokeWidth={1.6}
                    className="shrink-0 text-cream"
                  />
                  <div className="min-w-0">
                    <h3 className="font-card text-[15px] font-semibold leading-snug text-paper">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 font-sans text-[13px] leading-[1.6] text-white/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
