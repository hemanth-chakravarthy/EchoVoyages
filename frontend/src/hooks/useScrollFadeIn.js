import { useRef, useEffect } from "react";

const useScrollFadeIn = (
  direction = "up",
  distance = "50px",
  duration = "1s"
) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.style.transition = `opacity ${duration} ease-out, transform ${duration} ease-out`;
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translate(0, 0)";
      }
    };

    const observer = new IntersectionObserver(handleScroll, { threshold: 0.2 });
    if (elementRef.current) {
      observer.observe(elementRef.current);
      elementRef.current.style.opacity = 0;
      elementRef.current.style.transform = `translateY(${
        direction === "up" ? distance : `-${distance}`
      })`;
    }

    return () => observer.disconnect();
  }, [direction, distance, duration]);

  return elementRef;
};

export default useScrollFadeIn;
