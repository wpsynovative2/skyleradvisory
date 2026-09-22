import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import FindProperties from "@/components/sections/FindProperties";
import MarketPresence from "@/components/sections/MarketPresence";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Process from "@/components/sections/Process";
import Values from "@/components/sections/Values";
import Team from "@/components/sections/Team";
import ProjectSupport from "@/components/sections/ProjectSupport";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <FindProperties />
      <MarketPresence />
      <Services />
      <WhyChooseUs />
      <Process />
      <Values />
      <Team />
      <ProjectSupport />
      <Contact />
    </>
  );
}
