import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedSection = ({ children, enter, leave, animationType, persist, align = "left", className = "" }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // We rely on the ScrollTrigger from the parent bounding container
    // However, since we are doing custom absolute positioning within a big scroll container,
    // we use `enter` and `leave` percentage values bound strictly to the overall scroll progress.
    // Instead of simple intersection observer, we'll map a scroll trigger explicitly to the document's body
    // and use `onUpdate` to trigger the timeline based on global scroll percentage if needed, OR we can 
    // just stick this section at absolute position based on % and use normal ScrollTrigger!

    const targetElements = section.querySelectorAll(
      ".section-label, .section-heading, .section-body, .section-note, .cta-button, .stat"
    );

    const tl = gsap.timeline({ paused: true });

    switch (animationType) {
      case "fade-up":
        tl.from(targetElements, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" });
        break;
      case "slide-left":
        tl.from(targetElements, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
        break;
      case "slide-right":
        tl.from(targetElements, { x: 80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
        break;
      case "scale-up":
        tl.from(targetElements, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: "power2.out" });
        break;
      case "rotate-in":
        tl.from(targetElements, { y: 40, rotation: 3, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" });
        break;
      case "stagger-up":
        tl.from(targetElements, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });
        break;
      case "clip-reveal":
        tl.from(targetElements, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.inOut" });
        break;
      default:
        tl.from(targetElements, { y: 50, opacity: 0, duration: 0.9 });
    }

    // Because SKILL.md wants absolute positioning via enter/leave ranges:
    // We position the section absolutely at the midpoint of `enter` and `leave`
    const midPoint = (enter + leave) / 2;
    section.style.top = `${midPoint}%`;

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = self.progress * 100; // 0 to 100
        
        // Is it inside the active range?
        if (p >= enter && p <= leave) {
          if (tl.progress() === 0) {
             tl.play();
          }
        } else {
          // If we left the range
          if (persist && p > leave) {
            // Keep it visible
          } else {
             if (tl.progress() > 0) {
               tl.reverse();
             }
          }
        }
      }
    });

    return () => {
      st.kill();
    };
  }, [enter, leave, animationType, persist]);

  const alignClass = align === "left" 
    ? "px-[5vw] md:pl-[5vw] md:pr-[55vw] items-center md:items-start text-center md:text-left" 
    : align === "right" 
      ? "px-[5vw] md:pl-[55vw] md:pr-[5vw] items-center md:items-start text-center md:text-left" 
      : "px-[5vw] items-center text-center";

  return (
    <section 
      ref={sectionRef} 
      className={`absolute w-full -translate-y-1/2 flex flex-col justify-center pointer-events-none ${alignClass} ${className}`}
    >
      <div className="max-w-[90vw] md:max-w-[40vw] w-full">
        {children}
      </div>
    </section>
  );
};

export default AnimatedSection;
