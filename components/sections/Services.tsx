import Image from "next/image";
import services from "@/data/services.json";
import Icon, { AngleDoubleRight } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";

export default function Services() {
  return (
    <section id={services.id} className="bg-cream py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <p className="font-label text-[20px] font-semibold uppercase tracking-[0.08em] text-orange">
            {services.label}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-2 font-sans text-[14px] text-body">{services.subtitle}</p>
        </Reveal>

        <TypedHeading
          heading={services.heading}
          className="mt-4 font-display text-[28px] font-extrabold leading-[1.2] sm:text-[34px] lg:text-[40px]"
          prefixClassName="text-black"
          typedClassName="text-orange"
        />

        <div className="mt-11 grid gap-6 lg:grid-cols-[1fr_1fr_minmax(0,430px)]">
          {/* Two columns of cards, then the tall photo */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            {services.items.map((service, index) => (
              <Reveal key={service.slug} delay={index * 90}>
                <article className="group relative h-full overflow-hidden rounded-lg border border-line-soft bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(40,35,96,0.13)]">
                  <Icon name={service.icon} size={34} strokeWidth={1.6} className="text-orange" />

                  <h3 className="mt-6 font-display text-[22px] font-semibold leading-snug text-black sm:text-[25px]">
                    {service.title}
                  </h3>

                  <p className="mt-3 font-sans text-[14px] leading-[1.75] text-body">{service.scope}</p>

                  <ul className="mt-6">
                    {service.offerings.map((offering, i) => (
                      <li
                        key={offering}
                        className={`flex items-center gap-3 py-2.5 ${
                          i < service.offerings.length - 1 ? "border-b border-line-soft" : ""
                        }`}
                      >
                        <AngleDoubleRight size={13} className="shrink-0 text-orange" />
                        <span className="font-sans text-[14px] text-body">{offering}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-lg lg:min-h-[1010px]">
              <Image
                src={services.image}
                alt="Skyler Advisory project"
                fill
                sizes="(max-width: 1024px) 100vw, 430px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
