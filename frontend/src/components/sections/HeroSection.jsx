import React from "react";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <div
      className="hero mb-16 ml-5 mr-5 rounded-lg relative"
      style={{ width: "auto", height: "50rem" }}
    >
      {/* Video background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="../public/videos/homepage_video.mp4"
        autoPlay
        loop
        muted
      ></video>
      {/* Overlay */}
      <div className="hero-overlay bg-opacity-60 absolute top-0 left-0 w-full h-full bg-black"></div>
      {/* Content */}
      <div className="hero-content text-neutral-content text-center relative z-10">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">
            Ready for your next adventure??
          </h1>
          <p className="mb-5">
            Discover breathtaking destinations, plan unforgettable trips, and
            connect with local guides and travel experts. Your next adventure
            starts here!
          </p>
          <Link
            to={`/search`}
            className="bg-transparent text-transparent font-bold py-3 px-8 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
