import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import ValueProp from "@/components/sections/ValueProp";
import TravelStyles from "@/components/sections/TravelStyles";
import Destinations from "@/components/sections/Destinations";
import Testimonials from "@/components/sections/Testimonials";
import Metrics from "@/components/sections/Metrics";
import Footer from "@/components/sections/Footer";
import CurtainShell from "@/components/sections/CurtainShell";

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Nav />
      <CurtainShell>
        <main>
          <Hero />
          <ValueProp />
          <TravelStyles />
          <Destinations />
          <Testimonials />
          <Metrics />
        </main>
      </CurtainShell>
      <Footer />
    </SmoothScroll>
  );
}
