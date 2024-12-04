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
          <Link to={`/search`} className="btn btn-primary">
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
