import support from "@/data/project-support.json";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";

export default function ProjectSupport() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <TypedHeading
          heading={support.heading}
          className="font-display text-[28px] font-extrabold leading-[1.2] sm:text-[34px] lg:text-[40px]"
          prefixClassName="text-body"
          typedClassName="text-orange"
        />

        <Reveal delay={120}>
          <p className="mt-4 max-w-[1120px] font-sans text-[15px] leading-[1.8] text-body">
            {support.description}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {support.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <article className="h-full rounded-md border border-line-soft bg-white px-6 py-7 transition-shadow duration-300 hover:shadow-[0_14px_38px_rgba(40,35,96,0.12)]">
                <Icon name={item.icon} size={30} strokeWidth={1.7} className="text-navy" />
                <h3 className="mt-6 font-card text-[17px] font-semibold leading-snug text-navy sm:text-[18px]">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-[14px] leading-[1.7] text-body">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
