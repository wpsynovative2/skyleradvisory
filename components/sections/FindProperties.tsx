import Image from "next/image";
import { ArrowRight } from "lucide-react";
import find from "@/data/find-properties.json";
import Reveal from "@/components/ui/Reveal";

export default function FindProperties() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={find.background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="mx-auto flex min-h-[420px] max-w-[1200px] flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[550px]">
        <div className="max-w-[820px]">
          <Reveal>
            <h2 className="font-label text-[28px] font-semibold leading-tight text-white sm:text-[34px] lg:text-[40px]">
              {find.title}
            </h2>
          </Reveal>

          <Reveal delay={110}>
            <p className="mt-5 max-w-[760px] font-sans text-[15px] leading-[1.8] text-white/85">
              {find.description}
            </p>
          </Reveal>

          <Reveal delay={210}>
            <a
              href={find.cta.href}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-navy px-7 py-3.5 font-sans text-[14px] font-semibold text-white transition hover:bg-orange"
            >
              {find.cta.label}
              <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
