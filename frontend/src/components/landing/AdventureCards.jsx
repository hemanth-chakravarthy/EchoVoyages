import {adventurecards} from "../assets";
import styles, { layout } from "../style";
import { motion } from "framer-motion";
import '../landingpage.css';

const AdventureCards = () => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    id="product" 
    className="flex md:flex-row-reverse flex-col py-16 bg-grey"
  >
    <motion.div 
      className="flex-1 flex justify-center items-center md:ml-10 ml-0"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img 
        src={adventurecards} 
        alt="billing" 
        className="w-[100%] h-[100%] object-contain rounded-xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>

    <motion.div 
      className="flex-1 flex justify-center items-start flex-col px-6"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="bg-black-gradient p-8 rounded-xl"
        whileHover={{
          y: -5,
          scale: 1.02,
          boxShadow: "0 22px 45px -12px rgba(0, 0, 0, 0.25)"
        }}
      >
        <h2 className="text-5xl font-bold text-white tracking-tight mb-6">
          Start Your Adventure <br className="sm:block hidden" /> Today!!
        </h2>
        <p className="text-dimWhite leading-relaxed max-w-[470px] mt-5">
          Your dream destination is just a click away.<br className="sm:block hidden" />
          Explore breathtaking locations.<br className="sm:block hidden" />
          Book curated stays and experiences.<br className="sm:block hidden" />
          Enjoy a hassle-free journey from start to finish.<br className="sm:block hidden" />
          Let's make your next trip extraordinary! 🌎✨
        </p>
      </motion.div>
    </motion.div>
  </motion.section>
);

export default AdventureCards;
