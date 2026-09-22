import Image from "next/image";
import { ArrowRight } from "lucide-react";
import missionVision from "@/data/mission-vision.json";
import Reveal from "@/components/ui/Reveal";
import { AngleDoubleRight } from "@/components/ui/Icon";

/** Mission and Vision blocks — alternating image / copy, inside the team band. */
export default function MissionVision() {
  return (
    <div className="mt-16 space-y-14 lg:mt-20 lg:space-y-16">
      {missionVision.items.map((item) => (
        <div key={item.key} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className={item.imageFirst ? "" : "lg:order-2"}>
            <div className="overflow-hidden rounded-sm">
              <Image
                src={item.image}
                alt={item.title}
                width={760}
                height={520}
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>

          <div className={item.imageFirst ? "" : "lg:order-1"}>
            <Reveal>
              <h2 className="font-display text-[24px] font-semibold text-navy sm:text-[30px]">
                {item.title}
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-4 font-sans text-[15px] leading-[1.8] text-body">{item.statement}</p>
            </Reveal>

            <ul className="mt-6">
              {item.points.map((point, index) => (
                <Reveal key={point} delay={160 + index * 80} as="li">
                  <div
                    className={`flex items-start gap-3 py-3 ${
                      index < item.points.length - 1 ? "border-b border-line-soft" : ""
                    }`}
                  >
                    <AngleDoubleRight size={14} className="mt-1 shrink-0 text-orange" />
                    <span className="font-sans text-[15px] leading-relaxed text-body">{point}</span>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={420}>
              <a
                href={item.cta.href}
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-navy px-7 py-3.5 font-sans text-[14px] font-semibold text-white transition hover:bg-orange"
              >
                {item.cta.label}
                <ArrowRight size={15} />
              </a>
            </Reveal>
          </div>
        </div>
      ))}
    </div>
  );
}
