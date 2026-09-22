import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import market from "@/data/market.json";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";

function LocationCard({ locations }: { locations: string[] }) {
  return (
    <div className="rounded-lg border border-line-soft bg-white/70 px-5 py-2.5">
      <ul>
        {locations.map((location, index) => (
          <li
            key={location}
            className={`flex items-center gap-3 py-3 ${
              index < locations.length - 1 ? "border-b border-line-soft" : ""
            }`}
          >
            <MapPin size={15} className="shrink-0 text-navy" />
            <span className="font-sans text-[14px] uppercase tracking-[0.04em] text-body">
              {location}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketPresence() {
  return (
    <section id={market.id} className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src={market.background} alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>

      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14 lg:py-20">
        <Reveal>
          <div className="overflow-hidden rounded-lg shadow-[0_10px_40px_rgba(2,1,1,0.10)]">
            <Image
              src={market.map}
              alt="Mumbai micro-markets covered by Skyler Advisory"
              width={620}
              height={820}
              sizes="(max-width: 1024px) 90vw, 420px"
              className="h-auto w-full object-contain"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-label text-[20px] font-semibold uppercase tracking-[0.08em] text-navy">
              {market.label}
            </p>
          </Reveal>

          <TypedHeading
            heading={market.heading}
            className="mt-3 font-display text-[28px] font-extrabold leading-[1.2] sm:text-[34px] lg:text-[40px]"
            prefixClassName="text-black"
            typedClassName="text-orange"
          />

          <Reveal delay={140}>
            <p className="mt-5 max-w-[720px] font-sans text-[15px] leading-[1.8] text-body">
              {market.description}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <LocationCard locations={market.locationsLeft} />
              <LocationCard locations={market.locationsRight} />
            </div>
          </Reveal>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {market.stats.map((stat, index) => (
              <Reveal key={stat.lineTwo} delay={260 + index * 90}>
                <div className="rounded-lg border border-navy px-5 py-6 text-center">
                  <p className="font-numeric text-[34px] font-bold leading-none text-body sm:text-[38px]">
                    <Counter value={stat.value} prefix={stat.prefix} />
                    <span className="text-[22px] font-medium">{stat.suffix}</span>
                  </p>
                  <p className="mt-3 font-sans text-[14px] leading-[1.5] text-body">
                    {stat.lineOne}
                    <br />
                    {stat.lineTwo}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={540}>
            <a
              href={market.cta.href}
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-navy px-7 py-3.5 font-sans text-[14px] font-semibold text-white transition hover:bg-orange"
            >
              {market.cta.label}
              <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
