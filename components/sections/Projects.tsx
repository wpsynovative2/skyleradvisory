"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import projects from "@/data/projects.json";
import Reveal from "@/components/ui/Reveal";
import { useEnquiryModal } from "@/components/ui/EnquiryModalProvider";

export default function Projects() {
  const { open } = useEnquiryModal();
  const [index, setIndex] = useState(0);
  const items = projects.items;


  const go = (direction: 1 | -1) =>
    setIndex((current) => (current + direction + items.length) % items.length);

  return (
    <section id={projects.id} className="relative isolate overflow-hidden py-14 lg:py-16">
      <div className="absolute inset-0 -z-10">
        <Image src={projects.background} alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>

      <div className="mx-auto flex max-w-[1240px] items-stretch gap-4 px-4 sm:px-6">
        {/* Rotated section label */}
        <div className="hidden shrink-0 items-center lg:flex">
          <span className="vertical-label text-[56px] xl:text-[72px]">{projects.label}</span>
        </div>

        <Reveal className="min-w-0 flex-1">
          <div className="grid overflow-hidden rounded-[18px] border border-navy/70 lg:grid-cols-[minmax(0,420px)_1fr]">
            {/* Image with the slider controls — all slides stay mounted */}
            <div className="relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
              {items.map((item, i) => (
                <Image
                  key={item.slug}
                  src={item.image}
                  alt={`${item.nameFirst} ${item.nameRest}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  aria-hidden={i !== index}
                  className={`object-cover transition-opacity duration-500 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              <div className="absolute bottom-0 left-0 z-10 flex">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous project"
                  className="grid h-14 w-16 place-items-center bg-white text-navy transition hover:bg-navy hover:text-white"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next project"
                  className="grid h-14 w-16 place-items-center bg-white text-navy transition hover:bg-navy hover:text-white"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            {/* Copy — the inactive slides stay in the DOM but are hidden */}
            <div className="relative px-7 py-10 sm:px-12 lg:px-14">
              {items.map((item, i) => (
                <div
                  key={item.slug}
                  hidden={i !== index}
                  className="flex h-full flex-col justify-center"
                >
                  <p className="font-display text-[20px] font-medium text-body sm:text-[24px]">
                    {item.location}
                  </p>

                  <h2 className="project-title mt-3 text-[34px] sm:text-[46px] lg:text-[56px] xl:text-[65px]">
                    <span className="filled bg-black/5 px-1">{item.nameFirst}</span>
                    {item.nameBreak ? <br /> : " "}
                    {item.nameRest}
                  </h2>

                  <p className="mt-6 max-w-[520px] font-sans text-[15px] leading-[1.85] text-body">
                    {item.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => open(`Project: ${item.nameFirst} ${item.nameRest}`)}
                    className="mt-8 inline-flex w-fit items-center gap-3 rounded-sm bg-navy px-8 py-4 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-orange"
                  >
                    {projects.detailsLabel}
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Slide indicators */}
      <div className="mx-auto mt-7 flex max-w-[1240px] justify-center gap-2 px-4 lg:hidden">
        {items.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${item.nameFirst} ${item.nameRest}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-7 bg-navy" : "w-2.5 bg-navy/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
