import process from "@/data/process.json";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

export default function Process() {
  return (
    <section className="bg-white pt-16 lg:pt-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <p className="font-label text-[20px] font-semibold uppercase tracking-[0.08em] text-orange">
            {process.label}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-3 font-display text-[28px] font-extrabold leading-[1.2] text-black sm:text-[34px] lg:text-[40px]">
            Our Mandate Execution <span className="text-orange">Process</span>
          </h2>
        </Reveal>

        <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 100}>
              <article className="relative flex h-full flex-col rounded-md border border-line-soft bg-white px-6 py-7 transition-shadow duration-300 hover:shadow-[0_14px_38px_rgba(40,35,96,0.12)]">
                <Icon name={item.icon} size={32} strokeWidth={1.7} className="text-navy" />

                <h3 className="mt-6 border-b border-line-soft pb-3 font-label text-[18px] font-semibold leading-snug text-navy sm:text-[20px]">
                  {item.title}
                </h3>

                <p className="mt-4 font-sans text-[14px] leading-[1.75] text-body">
                  {item.description}
                </p>

                <span className="mt-6 self-end font-numeric text-[40px] font-semibold leading-none text-ghost">
                  {item.step}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
