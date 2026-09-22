import contact from "@/data/contact.json";
import EnquiryForm from "@/components/forms/EnquiryForm";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import TypedHeading from "@/components/ui/TypedHeading";

export default function Contact() {
  return (
    <section id={contact.id} className="bg-cream py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <TypedHeading
          heading={contact.heading}
          className="text-center font-display text-[30px] font-extrabold leading-[1.2] sm:text-[36px] lg:text-[42px]"
          prefixClassName="text-black"
          typedClassName="text-orange"
        />

        <Reveal delay={120}>
          <p className="mx-auto mt-4 max-w-[900px] text-center font-sans text-[15px] leading-[1.8] text-body">
            {contact.description}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Contact information */}
          <div>
            <Reveal>
              <h3 className="font-display text-[26px] font-semibold text-navy sm:text-[32px]">
                {contact.infoTitle}
              </h3>
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-4 max-w-[560px] font-sans text-[15px] leading-[1.8] text-body">
                {contact.infoDescription}
              </p>
            </Reveal>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {contact.cards.map((card, index) => (
                <Reveal key={card.title} delay={150 + index * 80}>
                  <div className="h-full rounded-md border border-line-soft bg-white/60 px-6 py-6">
                    <Icon name={card.icon} size={30} strokeWidth={1.8} className="text-navy" />
                    <h4 className="mt-5 font-card text-[17px] font-semibold text-navy sm:text-[18px]">
                      {card.title}
                    </h4>
                    <div className="mt-2 space-y-0.5">
                      {card.lines.map((line, i) => {
                        const href = card.hrefs?.[i];
                        return href ? (
                          <a
                            key={line}
                            href={href}
                            className="block font-sans text-[14px] leading-[1.6] text-body transition hover:text-navy"
                          >
                            {line}
                          </a>
                        ) : (
                          <p key={line} className="font-sans text-[14px] leading-[1.6] text-body">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Form */}
          <Reveal delay={120}>
            <div className="rounded-md border border-line-soft bg-white p-6 sm:p-9">
              <h3 className="font-display text-[24px] font-semibold text-navy sm:text-[30px]">
                {contact.formTitle}
              </h3>
              <div className="mt-6">
                <EnquiryForm source="Contact Section" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
