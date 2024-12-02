import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/sections/HeroSection";
import FeatureStatsSection from "../components/sections/FeatureStatsSection";
import MakeYourChoiceSection from "../components/sections/MakeYourChoiceSection";
import GuidesInfo from "../components/sections/GuidesInfo";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import AgenciesInfo from "../components/sections/AgenciesInfo";
import Footer from "../components/sections/Footer";

const HomePage = () => {
  const makeYourChoiceRef = useRef(null);
  return (
    <>
      <Navbar />
      <HeroSection />
      <section ref={makeYourChoiceRef}>
        <FeatureStatsSection />
      </section>
      <HowItWorksSection prevSectionRef={makeYourChoiceRef} />
      <GuidesInfo />
      <MakeYourChoiceSection />
      <AgenciesInfo />
      <Footer />
    </>
  );
};

export default HomePage;
