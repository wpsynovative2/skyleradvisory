"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import values from "@/data/values.json";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";

export default function Values() {
  const [index, setIndex] = useState(0);
  const items = values.items;


  const go = (direction: 1 | -1) =>
    setIndex((current) => (current + direction + items.length) % items.length);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <TypedHeading
          heading={values.heading}
          className="font-display text-[28px] font-extrabold leading-[1.2] sm:text-[34px] lg:text-[40px]"
          prefixClassName="text-body"
          typedClassName="text-orange"
        />

        <Reveal delay={120}>
          <p className="mt-4 max-w-[1120px] font-sans text-[15px] leading-[1.8] text-body">
            {values.description}
          </p>
        </Reveal>

        <Reveal delay={200}>
          {/* Every slide stays in the DOM and crossfades, as the original carousel does */}
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-sm sm:aspect-[2/1] lg:aspect-[1200/600]">
            {items.map((item, i) => (
              <div
                key={item.title}
                aria-hidden={i !== index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-[8%] px-6 text-center">
                  <h3 className="font-card text-[26px] font-black uppercase leading-none text-white drop-shadow sm:text-[32px] lg:text-[36px]">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-sans text-[14px] text-white/90 drop-shadow sm:text-[16px]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous value"
            className="text-navy transition hover:text-orange"
          >
            <ArrowLeft size={26} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next value"
            className="text-navy transition hover:text-orange"
          >
            <ArrowRight size={26} />
          </button>
        </div>
      </div>
    </section>
  );
}
