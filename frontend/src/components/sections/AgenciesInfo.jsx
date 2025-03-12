import React from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";
import { Link } from "react-router-dom";

const AgenciesInfo = () => {
  const fadeInRef = useScrollFadeIn("up", "50px", "1s");
  return (
    <section ref={fadeInRef} className="fade-in-component py-16">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8 justify-center items-center">
        <Link to={`/home`} className="block">
          <button className="absolute bottom-4 right-4 px-8 shadow-lg bg-transparent text-transparent font-bold py-3 px- rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient">
            View Packages
          </button>
        </Link>

        {/* Left Image */}
        <div
          className="relative w-full lg:w-1/2 flex flex-col"
          style={{ height: "calc(250px + 200px + 80px)" }}
        >
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Burger"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right Stacked Images */}
        <div className="flex flex-col gap-8 justify-center items-center w-full lg:w-1/2">
          <div
            className="relative w-full"
            style={{ height: "calc(200px + 55px)" }}
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1719843013722-c2f4d69db940?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Burger"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div
            className="relative w-full"
            style={{ height: "calc(200px + 55px)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Burger"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgenciesInfo;
