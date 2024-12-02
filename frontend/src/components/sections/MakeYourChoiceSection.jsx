// src/components/sections/MakeYourChoiceSection.jsx

import React from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";

const MakeYourChoiceSection = () => {
  const fadeInRef = useScrollFadeIn("up", "50px", "1s");
  return (
    <div ref={fadeInRef} className="flex w-full flex-col lg:flex-row mt-5 mb-5">
      <div className="card bg-base-300 m-16 rounded-box grid h-72 flex-grow place-items-center">
        content
      </div>
      <div className="divider lg:divider-horizontal">OR</div>
      <div className="card bg-base-300 m-16 rounded-box grid h-72 flex-grow place-items-center">
        content
      </div>
    </div>
  );
};

export default MakeYourChoiceSection;
