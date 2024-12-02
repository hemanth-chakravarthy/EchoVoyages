// src/components/sections/FeatureStatsSection.jsx

import React from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";

const FeatureStatsSection = () => {
  const fadeInRef = useScrollFadeIn("up", "50px", "1s");
  return (
    <div ref={fadeInRef} className="w-full bg-base-200 py-16">
      <div className="stats shadow py-8 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-0 justify-center">
        <div className="stat place-items-center">
          <div className="stat-title">Happy Customers</div>
          <div className="stat-value">31K</div>
          <div className="stat-desc">From January 1st to February 1st</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Partner Agencies</div>
          <div className="stat-value">4,200</div>
          <div className="stat-desc">↗︎ 40 (2%)</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Guides Available</div>
          <div className="stat-value">1,200</div>
          <div className="stat-desc">↗︎ 90 (14%)</div>
        </div>
      </div>
    </div>
  );
};

export default FeatureStatsSection;
