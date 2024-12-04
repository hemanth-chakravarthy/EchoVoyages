import React from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";

const MakeYourChoiceSection = () => {
  const fadeInRef = useScrollFadeIn("up", "50px", "1s");

  return (
    <div ref={fadeInRef} className="flex w-full flex-col lg:flex-row mt-5 mb-5">
      {/* Guide Option */}
      <div className="card bg-base-100 m-16 rounded-box grid h-72 flex-grow place-items-center shadow-lg">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-2">
            Explore with a Local Guide
          </h2>
          <p className="text-lg mb-3">
            Experience personalized tours and discover hidden gems with an
            expert local.
          </p>
          <ul className="list-disc list-inside">
            <li>Tailored itineraries</li>
            <li>Unique cultural experiences</li>
            <li>Local insights and stories</li>
          </ul>
        </div>
      </div>

      <div className="divider lg:divider-horizontal">OR</div>

      {/* Agency Package Option */}
      <div className="card bg-base-100 m-16 rounded-box grid h-72 flex-grow place-items-center shadow-lg">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-2">Book an Agency Package</h2>
          <p className="text-lg mb-3">
            Enjoy a seamless trip with pre-planned itineraries and all-in-one
            convenience.
          </p>
          <ul className="list-disc list-inside">
            <li>Comfortable accommodations</li>
            <li>Guided tours and activities</li>
            <li>Stress-free planning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MakeYourChoiceSection;
