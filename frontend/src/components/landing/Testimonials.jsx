import { feedback } from "../constants";
import styles from "../style";
import FeedbackCard from "./FeedbackCard";
import { motion } from "framer-motion";
import '../landingpage.css';

const Testimonials = () => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    id="clients"
    className="py-16 flex flex-col relative bg-grey"
  >
    <motion.div 
      className="mx-auto sm:mb-16 mb-6 relative z-[1] container px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div 
        className="bg-black-gradient p-10 rounded-xl"
        whileHover={{
          y: -5,
          scale: 1.02,
          boxShadow: "0 22px 45px -12px rgba(0, 0, 0, 0.25)"
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <h2 className="text-5xl font-bold text-white tracking-tight">
            What People are <br className="sm:block hidden" /> saying about us?
          </h2>
          <p className="text-dimWhite leading-relaxed max-w-[450px] md:mt-0 mt-6">
            Everything you need to plan, book, and enjoy seamless travel experiences 
            anywhere on the planet.
          </p>
        </div>
      </motion.div>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-4"
    >
      {feedback.map((card) => (
        <FeedbackCard key={card.id} {...card} />
      ))}
    </motion.div>
  </motion.section>
);

export default Testimonials;
