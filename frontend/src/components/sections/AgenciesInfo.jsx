import React from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";

const AgenciesInfo = () => {
  const fadeInRef = useScrollFadeIn("up", "50px", "1s");
  return (
    <section ref={fadeInRef} className="fade-in-component py-16">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8 justify-center items-center">
        {/* Left Image */}
        <div
          className="relative w-full lg:w-1/2 flex flex-col"
          style={{ height: "calc(250px + 200px + 80px)" }}
        >
          <img
            src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
            alt="Burger"
            className="w-full h-full object-cover rounded-lg"
          />
          <button className="absolute bottom-4 right-4 bg-primary text-white py-3 px-8 rounded-full shadow-lg">
            Explore More
          </button>
        </div>

        {/* Right Stacked Images */}
        <div className="flex flex-col gap-8 justify-center items-center w-full lg:w-1/2">
          <div
            className="relative w-full"
            style={{ height: "calc(200px + 55px)" }}
          >
            <img
              src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
              alt="Burger"
              className="w-full h-full object-cover rounded-lg"
            />
            <button className="absolute bottom-4 right-4 bg-primary text-white py-3 px-8 rounded-full shadow-lg">
              Explore More
            </button>
          </div>
          <div
            className="relative w-full"
            style={{ height: "calc(200px + 55px)" }}
          >
            <img
              src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
              alt="Burger"
              className="w-full h-full object-cover rounded-lg"
            />
            <button className="absolute bottom-4 right-4 bg-primary text-white py-3 px-8 rounded-full shadow-lg">
              Explore More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgenciesInfo;
