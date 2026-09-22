"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import why from "@/data/why-choose-us.json";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";
import { SkylerMark } from "@/components/ui/Icon";
import { useEnquiryModal } from "@/components/ui/EnquiryModalProvider";

export default function WhyChooseUs() {
  const { open } = useEnquiryModal();

  return (
    <section className="relative overflow-hidden bg-navy py-16 lg:py-20">
      {/* Oversized watermark, bottom-right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 right-0 select-none font-sans text-[46px] font-semibold capitalize leading-none text-white/[0.11] sm:text-[60px] lg:text-[69px]"
      >
        {why.watermark}
      </span>

      <div className="mx-auto grid max-w-[1200px] items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm lg:mt-20 lg:aspect-auto lg:h-[558px]">
            <Image
              src={why.image}
              alt="Skyler Advisory project elevation"
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-label text-[20px] font-semibold uppercase tracking-[0.08em] text-white">
              {why.label}
            </p>
          </Reveal>

          <TypedHeading
            heading={why.heading}
            className="mt-3 font-display text-[26px] font-extrabold leading-[1.2] sm:text-[31px] lg:text-[35px]"
            prefixClassName="text-white"
            typedClassName="text-orange"
          />

          <Reveal delay={140}>
            <p className="mt-5 max-w-[760px] font-sans text-[14px] leading-[1.8] text-white/80">
              {why.description}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {why.items.map((item, index) => (
              <Reveal key={item.title} delay={200 + index * 90}>
                <div className="h-full rounded-md border border-white/15 bg-white/[0.06] px-6 py-6 transition-colors duration-300 hover:border-orange/60 hover:bg-white/[0.1]">
                  <div className="flex items-center gap-3">
                    <SkylerMark size={20} className="shrink-0 text-orange" />
                    <h3 className="font-display text-[20px] font-semibold text-white sm:text-[23px]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 font-sans text-[13px] leading-[1.7] text-white/70">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={580}>
            <button
              type="button"
              onClick={() => open("Why Choose Us")}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 font-sans text-[14px] font-semibold text-navy transition hover:bg-orange hover:text-white"
            >
              {why.cta.label}
              <ArrowRight size={15} />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
