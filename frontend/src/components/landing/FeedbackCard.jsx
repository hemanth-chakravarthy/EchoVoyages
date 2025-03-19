import { quotes } from "../assets";
import { motion } from "framer-motion";
import '../landingpage.css';

const FeedbackCard = ({ content, name, title, img }) => (
  <motion.div
    whileHover={{
      y: -5,
      scale: 1.01,
      boxShadow: "0 22px 45px -12px rgba(0, 0, 0, 0.25)"
    }}
    className="bg-black-gradient p-8 rounded-xl min-h-[300px] flex flex-col justify-between"
  >
    <p className="text-dimWhite leading-relaxed mb-8">
      {content}
    </p>

    <div className="flex items-center">
      <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div className="ml-4">
        <h4 className="text-white font-semibold text-lg">
          {name}
        </h4>
        <p className="text-dimWhite text-sm">
          {title}
        </p>
      </div>
    </div>
  </motion.div>
);

export default FeedbackCard;
