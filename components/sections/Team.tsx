import Image from "next/image";
import team from "@/data/team.json";
import Counter from "@/components/ui/Counter";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";
import MissionVision from "./MissionVision";

export default function Team() {
  return (
    <section id={team.id} className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src={team.background} alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20">
        <Reveal>
          <p className="font-label text-[20px] font-semibold uppercase tracking-[0.08em] text-orange">
            {team.label}
          </p>
        </Reveal>

        <TypedHeading
          heading={team.heading}
          className="mt-3 font-display text-[28px] font-extrabold leading-[1.2] sm:text-[34px] lg:text-[40px]"
          prefixClassName="text-black"
          typedClassName="text-orange"
        />

        <Reveal delay={140}>
          <p className="mt-4 max-w-[1060px] font-sans text-[15px] leading-[1.8] text-body">
            {team.description}
          </p>
        </Reveal>

        {/* Leadership */}
        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.members.map((member, index) => (
            <Reveal key={member.name} delay={index * 100}>
              <article className="group h-full overflow-hidden bg-white shadow-[0_6px_28px_rgba(2,1,1,0.07)]">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="px-6 py-6">
                  <h3 className="font-display text-[22px] font-bold text-navy sm:text-[26px]">
                    {member.name}
                  </h3>
                  <p className="mt-1.5 font-sans text-[13px] font-semibold uppercase tracking-[0.06em] text-orange">
                    {member.role}
                  </p>
                  <p className="mt-4 font-sans text-[14px] leading-[1.75] text-body">{member.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Our Strength */}
        <TypedHeading
          heading={team.strengthHeading}
          className="mt-16 font-display text-[28px] font-extrabold leading-[1.2] sm:text-[34px] lg:text-[40px]"
          prefixClassName="text-body"
          typedClassName="text-orange"
        />

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <div className="rounded-md border border-navy px-5 py-7 text-center">
                <Icon name={stat.icon} size={30} strokeWidth={1.7} className="mx-auto text-ink" />
                <p className="mt-4 font-sans text-[15px] text-body">{stat.label}</p>
                <p className="mt-1 font-numeric text-[34px] font-bold leading-none text-ink sm:text-[38px]">
                  <Counter value={stat.value} />
                  <span className="text-[22px] font-medium">{stat.suffix}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <MissionVision />
      </div>
    </section>
  );
}
