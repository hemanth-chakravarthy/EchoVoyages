import { features } from "../constants";
import styles, { layout } from "../style";
import Button from "./Button";
import '../landingpage.css';
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, content, index }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex flex-row p-6 rounded-lg w-full max-w-[470px] mx-auto mb-6 bg-black-gradient"
  >
    <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center bg-blue-gradient/10">
      <img src={icon} alt="star" className="w-[50%] h-[50%] object-contain" />
    </div>
    <div className="flex-1 flex flex-col ml-4">
      <h4 className="font-semibold text-white text-[18px] leading-[23.4px] mb-1">
        {title}
      </h4>
      <p className="text-dimWhite text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </motion.div>
);

const Business = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    id="features" 
    className="flex md:flex-row flex-col py-16 bg-grey"
  >
    <motion.div 
      className="flex-1 flex justify-center items-start flex-col px-10 py-12 bg-black-gradient rounded-2xl relative overflow-hidden"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow: "0 22px 45px -12px rgba(0, 0, 0, 0.25)"
      }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-gradient rounded-full -translate-y-1/2 translate-x-1/2 opacity-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-gradient rounded-full translate-y-1/2 -translate-x-1/2 opacity-10" />

      <motion.h2 
        className="text-5xl font-bold text-white tracking-tight mb-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Why Travel With Us? <br className="sm:block hidden" /> 
      </motion.h2>
      <motion.p 
        className="text-dimWhite leading-relaxed max-w-[470px] mt-5 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        We are more than just a travel booking platform—we're your 
        trusted partner in creating extraordinary journeys. Here's why travelers love us:
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <Button styles="mt-10" />
      </motion.div>
    </motion.div>

    <div className="flex-1 flex justify-center items-center md:ml-10 ml-0 relative">
      <motion.div 
        className="flex flex-col items-center justify-center w-full max-w-[470px] space-y-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <FeatureCard {...feature} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

export default Business;
