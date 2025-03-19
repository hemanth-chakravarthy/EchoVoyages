import styles from "../style";
import Button from "./Button2";
import { motion } from "framer-motion";
import '../landingpage.css';

const CTA = () => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex sm:flex-row flex-col items-center justify-between py-16 px-12 bg-black-gradient rounded-2xl relative overflow-hidden my-16"
    whileHover={{
      y: -5,
      scale: 1.01,
      boxShadow: "0 22px 45px -12px rgba(0, 0, 0, 0.25)"
    }}
  >
    <motion.div 
      className="flex-1 flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div>
        <h2 className="text-5xl font-bold text-white tracking-tight mb-6">
          Embark on Your Journey Today!
        </h2>
        <p className="text-dimWhite leading-relaxed max-w-[470px] mt-5">
          Everything you need to book your next adventure and explore the world with ease, wherever you are.
        </p>
      </div>
    </motion.div>

    <motion.div 
      className="sm:ml-10 ml-0 sm:mt-0 mt-10"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Button />
    </motion.div>
  </motion.section>
);

export default CTA;
