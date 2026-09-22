import Image from "next/image";
import { ArrowRight } from "lucide-react";
import about from "@/data/about.json";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";
import { SkylerMark } from "@/components/ui/Icon";

export default function About() {
  return (
    <section id={about.id} className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src={about.background} alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>

      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
        {/* Glowing mark above an open hand */}
        <Reveal>
          {/* The mark floats just above the open palm. Both PNGs carry transparent
              padding (34% below the mark, 43% above the hand), so the negative
              margin below is what actually closes the visual gap. */}
          <div className="relative mx-auto flex max-w-[576px] flex-col items-center">
            <Image
              src={about.markImage}
              alt=""
              width={326}
              height={220}
              sizes="(max-width: 1024px) 45vw, 326px"
              className="animate-floaty h-auto w-[57%] object-contain"
            />
            <Image
              src={about.handImage}
              alt=""
              width={576}
              height={231}
              sizes="(max-width: 1024px) 80vw, 576px"
              className="-mt-[57%] h-auto w-full object-contain"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-label text-[20px] font-semibold uppercase tracking-[0.1em] text-orange">
              {about.label}
            </p>
          </Reveal>

          <TypedHeading
            heading={about.heading}
            className="mt-4 font-display text-[28px] font-extrabold leading-[1.25] sm:text-[34px] lg:text-[40px]"
            prefixClassName="text-white"
            typedClassName="text-orange"
          />

          <div className="mt-6 space-y-4">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 30)} delay={120 + index * 80}>
                <p className="font-sans text-[15px] leading-[1.85] text-white/85">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <ul className="mt-7 space-y-3">
            {about.points.map((point, index) => (
              <Reveal key={point} delay={260 + index * 60} as="li">
                <div className="flex items-start gap-3">
                  <SkylerMark size={16} className="mt-1 shrink-0 text-white" />
                  <span className="font-sans text-[14px] leading-relaxed text-white/90">{point}</span>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={580}>
            <a
              href={about.cta.href}
              className="mt-9 inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 font-sans text-[14px] font-semibold text-navy transition hover:bg-orange hover:text-white"
            >
              {about.cta.label}
              <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
