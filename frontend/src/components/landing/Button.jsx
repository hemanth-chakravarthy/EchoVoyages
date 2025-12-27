import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import '../landingpage.css';

const Button = ({ styles }) => {
  const navigate = useNavigate();  // Initialize navigate function

  const handleClick = () => {
    navigate("/signup");  // Redirect to /signup on button click
  };

  return (
    <button 
      type="button" 
      className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`} 
      onClick={handleClick}  // Add onClick handler
    >
      Get Started
    </button>
  );
};

export default Button;
