import styles from "../style";
import GetStarted from "./GetStarted";

import travelVideo1 from "../assets/travelVideo1.mp4";

const Hero = () => {
  return (
    <section
      id="home"
      className={`relative flex items-center justify-center ${styles.paddingY} h-screen overflow-hidden`}
    >
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[0] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
      </div>

      {/* Video Background */}
      <video
        src={travelVideo1}
        className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content */}
      <div className="relative z-[10] text-center flex flex-col items-center">
        <h1 className="font-poppins font-semibold text-[52px] md:text-[72px] text-white leading-[75px] md:leading-[100px]">
          Discover the <br className="hidden sm:block" />
          <span className="text-gradient">World</span> with ease
        </h1>
        <p className="mt-5 text-white text-[18px] max-w-[600px] mx-auto">
          Our team of experts uses a detailed methodology to identify the best
          travel packages tailored to your needs. We evaluate factors such as
          cost, destinations, accommodations, and travel experiences to ensure
          you get the most value out of your trips.
        </p>
        <div className="mt-8">
          <GetStarted />
        </div>
      </div>
    </section>
  );
};

export default Hero;
