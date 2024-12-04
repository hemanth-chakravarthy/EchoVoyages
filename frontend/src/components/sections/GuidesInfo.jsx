import React from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";
import { Link } from "react-router-dom";

const GuidesInfo = () => {
  const fadeInRef = useScrollFadeIn("up", "50px", "1s");
  return (
    <div ref={fadeInRef} className="container mx-auto px-4 py-32">
      <div>
        <Link to={`/customerGuide`} className="block">
          <button className="absolute bottom-4 right-4 px-8 shadow-lg bg-transparent text-transparent font-bold py-3 px- rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient">
            View Guides
          </button>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src="https://plus.unsplash.com/premium_photo-1716866638012-aee312a7a21e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D"
                alt="Guide 1"
                className="rounded-xl"
              />
            </figure>
          </div>

          <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src="https://plus.unsplash.com/premium_photo-1718146018997-a1059f9f9420?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Guide 2"
                className="rounded-xl"
              />
            </figure>
          </div>

          <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src="https://plus.unsplash.com/premium_photo-1716999413705-44286906c6c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Guide 3"
                className="rounded-xl"
              />
            </figure>
          </div>

          <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src="https://www.travelweekly.com.au/wp-content/uploads/2019/03/iStock-485614909.jpg"
                alt="Guide 4"
                className="rounded-xl"
              />
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesInfo;
