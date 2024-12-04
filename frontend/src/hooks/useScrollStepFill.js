import { useRef, useEffect, useState } from "react";

const useScrollStepFill = (numSteps, prevSectionRef) => {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current && prevSectionRef.current) {
        const prevSectionMid =
          prevSectionRef.current.getBoundingClientRect().top +
          prevSectionRef.current.offsetHeight / 4;
        const sectionHeight = sectionRef.current.offsetHeight;

        // Start scroll detection as soon as we reach midpoint of previous section
        const adjustedScrollFraction = Math.min(
          Math.max(1 - prevSectionMid / sectionHeight, 0),
          1
        );

        const newActiveStep = Math.ceil(adjustedScrollFraction * numSteps);
        setActiveStep(newActiveStep);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [numSteps, prevSectionRef]);

  return { sectionRef, activeStep };
};

export default useScrollStepFill;
