import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";
import { motion } from "framer-motion";
import '../landingpage.css';

const CardDeal = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
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
        Plan Your Next Trip <br className="sm:block hidden" />
      </motion.h2>
      
      <motion.p 
        className="text-dimWhite leading-relaxed max-w-[470px] mt-5 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Don't wait to explore the world. Start planning now and let us make your journey extraordinary.
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

    <motion.div 
      className="flex-1 flex justify-center items-center md:ml-10 ml-0 mt-10 md:mt-0"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.img 
        src={card} 
        alt="billing" 
        className="w-[100%] h-[100%] object-contain rounded-xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  </motion.section>
);

export default CardDeal;
