import React, { useRef } from "react";
import useScrollStepFill from "../../hooks/useScrollStepFill";

const HowItWorksSection = ({ prevSectionRef }) => {
  const { sectionRef, activeStep } = useScrollStepFill(4, prevSectionRef); // 4 steps

  return (
    <section ref={sectionRef} className="my-16">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <ul className="steps steps-vertical lg:steps-horizontal w-full justify-center">
        <li
          className={`step transition-all duration-10000 ${
            activeStep >= 1 ? "step-primary" : ""
          }`}
        >
          Register
        </li>
        <li
          className={`step transition-all duration-10000 ${
            activeStep >= 2 ? "step-primary" : ""
          }`}
        >
          Choose guide or agency
        </li>
        <li
          className={`step transition-all duration-10000 ${
            activeStep >= 3 ? "step-primary" : ""
          }`}
        >
          Book your dream package
        </li>
        <li
          className={`step transition-all duration-10000 ${
            activeStep >= 4 ? "step-primary" : ""
          }`}
        >
          Enjoy your trip!
        </li>
      </ul>
    </section>
  );
};

export default HowItWorksSection;
