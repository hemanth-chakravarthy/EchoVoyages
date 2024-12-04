import React from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";

const MakeYourChoiceSection = () => {
  const fadeInRef = useScrollFadeIn("up", "50px", "1s");

  return (
    <div ref={fadeInRef} className="flex w-full flex-col lg:flex-row mt-5 mb-5">
      {/* Guide Option */}
      <div className="card bg-base-100 m-16 rounded-box grid h-72 flex-grow place-items-center shadow-lg">
        <div className="text-center p-4">
          <h2 className="text-3xl font-bold mb-4">
            Discover the World with a Local Guide
          </h2>
          <p className="text-lg">
            Immerse yourself in unique cultural experiences and uncover hidden
            treasures guided by a local expert. Whether it's exploring historic
            landmarks or finding the best local cuisine, a guide ensures a truly
            personalized journey.
          </p>
        </div>
      </div>

      <div className="divider lg:divider-horizontal">OR</div>

      {/* Agency Package Option */}
      <div className="card bg-base-100 m-16 rounded-box grid h-72 flex-grow place-items-center shadow-lg">
        <div className="text-center p-4">
          <h2 className="text-3xl font-bold mb-4">
            Travel Hassle-Free with Agency Packages
          </h2>
          <p className="text-lg">
            Experience a worry-free journey with pre-planned itineraries and
            all-inclusive services for your convenience. From comfortable
            accommodations to guided activities, everything is taken care of so
            you can focus on enjoying your trip.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakeYourChoiceSection;
