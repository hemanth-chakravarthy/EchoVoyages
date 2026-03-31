/** @format */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiUrl from "../utils/api.js";
import backgroundVideo from "./assets/Girl_Enters_Cosmic_Dream_World.mp4";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    Name: "",
    phno: "",
    gmail: "",
    password: "",
    role: "customer",
    specialization: "luxury",
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "username":
        newErrors.username = validateUsername(value);
        break;
      case "Name":
        newErrors.Name = validateName(value);
        break;
      case "gmail":
        newErrors.gmail = validateEmail(value);
        break;
      case "password":
        newErrors.password = validatePassword(value);
        break;
      case "phno":
        newErrors.phno = validatePhoneNumber(value);
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Validation functions (same as before)
  const validateUsername = (username) => {
    const usernamePattern = /^[a-z][a-z0-9!@#$%^&*()_+-=]*$/;
    return usernamePattern.test(username)
      ? ""
      : "Username must start with a lowercase letter and can include lowercase letters, numbers, and special characters.";
  };

  // Update the validateName function
  const validateName = (name) => {
    const namePattern = /^[A-Za-z\s]+$/;
    if (!name) return "Name is required";
    if (!namePattern.test(name))
      return "Name can only contain letters and spaces";
    if (name.length < 2) return "Name must be at least 2 characters long";
    return "";
  };

  // Add this near the top with other state declarations
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");

  // Update the validatePhoneNumber function
  const validatePhoneNumber = (phno) => {
    const phoneNumberPattern = /^[0-9]{10}$/;
    const allZeros = /^0+$/;

    if (!phno) return "Phone number is required";
    if (allZeros.test(phno)) return "Phone number cannot be all zeros";
    if (!phoneNumberPattern.test(phno)) return "Phone number must be 10 digits";
    return "";
  };

  const validateEmail = (email) => {
    const emailPattern = /^[A-Za-z][A-Za-z0-9._-]*@[^\s@]+\.[A-Za-z]+$/;
    if (!email) return "Email is required";
    if (!emailPattern.test(email))
      return "Email must start with a letter and can contain letters, numbers, dots, underscores, or hyphens before @";
    return "";
  };

  const validatePassword = (password) => {
    const passwordLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!passwordLength) {
      return "Password must be at least 6 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }

    return "";
  };

  const validateForm = () => {
    let validationErrors = {};

    if (step === 1) {
      const usernameError = validateUsername(formData.username);
      if (usernameError) validationErrors.username = usernameError;

      const nameError = validateName(formData.Name);
      if (nameError) validationErrors.Name = nameError;
    }

    if (step === 2) {
      const phnoError = validatePhoneNumber(formData.phno);
      if (phnoError) validationErrors.phno = phnoError;

      const emailError = validateEmail(formData.gmail);
      if (emailError) validationErrors.gmail = emailError;
    }

    if (step === 3) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) validationErrors.password = passwordError;
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleNext = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setStep(step + 1);
    } else {
      console.log("Validation failed:", validationErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log("Form validation failed:", validationErrors);
      return;
    }

    // Include country code with phone number
    const formDataWithCountryCode = {
      ...formData,
      phno: selectedCountryCode + formData.phno,
    };

    try {
      const response = await fetch(`${apiUrl}/customers/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithCountryCode),
      });

      if (response.ok) {
        setFormData({
          username: "",
          Name: "",
          phno: "",
          gmail: "",
          password: "",
          role: "customer",
          specialization: "luxury",
        });
        setErrors({});
        toast.success("Signup successful!");
        navigate("/login");
        console.log("Signup successful!");
      } else {
        const data = await response.json();
        console.log("Signup failed with error:", data.error);
        toast.error(`Signup failed with error: ${data.error}`);
      }
    } catch (err) {
      console.error("Error signing up:", err);
      toast.error(`Error:${err}`);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-black text-white font-sans">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      {/* ===== FIXED NAVBAR (same as landing page) ===== */}
      <nav
        style={{ zIndex: 9999 }}
        className="fixed top-0 left-0 w-full flex items-start pt-6 px-4 sm:px-10 font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.2em] leading-relaxed text-white"
      >
        {/* ── LEFT ZONE (flex-1): Logo + Nav Links ── */}
        <div className="flex-1 flex items-start gap-8">
          <button onClick={() => navigate('/')} className="uppercase flex flex-col text-xs sm:text-sm font-black text-left leading-tight shrink-0">
            <span>Echo</span>
            <span>Voyage</span>
          </button>
          <div className="hidden lg:flex gap-8">
            <div className="flex flex-col gap-1 uppercase opacity-80">
              <button onClick={() => navigate('/home')} className="hover:opacity-100 transition-opacity text-left">Homepage</button>
              <button className="hover:opacity-100 transition-opacity text-left">Contact</button>
            </div>
            <div className="flex flex-col gap-1 uppercase opacity-80">
              <button onClick={() => navigate('/search')} className="hover:opacity-100 transition-opacity text-left">Destinations</button>
            </div>
          </div>
        </div>

        {/* ── CENTER (shrink-0): Icons Pill — always true center ── */}
        <div className="hidden md:flex shrink-0 items-center gap-4 backdrop-blur-md px-6 py-3 rounded-2xl border transition-colors duration-500 bg-white/10 border-white/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5 6.3 7.7 4.5 9.5l7 3.5-4 4-3.5-.5L2.5 18l4.5 1.5 1.5 4.5 1.5-1.5-.5-3.5 4-4 3.5 7 1.8-1.8z" />
          </svg>
          <div className="w-px h-6 bg-white/30 transition-colors duration-500"></div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14M7 10h2M7 14h2M15 10h2M15 14h2" />
          </svg>
        </div>

        {/* ── RIGHT ZONE (flex-1): Language + Search + Auth ── */}
        <div className="flex-1 hidden lg:flex justify-end items-start gap-8">
          <div className="flex flex-col gap-1 uppercase opacity-80">
            <span className="font-black">English</span>
          </div>
          <div className="flex items-center gap-1 uppercase opacity-80 cursor-pointer hover:opacity-100 transition-opacity">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Search</span>
          </div>
          <div className="flex flex-col gap-1 uppercase opacity-80">
            <button onClick={() => navigate('/login')} className="hover:opacity-100 transition-opacity text-left">Login</button>
            <button onClick={() => navigate('/signup')} className="hover:opacity-100 transition-opacity text-left">Register</button>
          </div>
        </div>

        {/* Hamburger - Mobile only */}
        <div className="flex-1 flex lg:hidden justify-end">
          <button className="hover:opacity-80" onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        style={{ zIndex: 10000 }}
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl text-white flex flex-col items-center justify-center p-8 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <button className="absolute top-8 right-10 hover:opacity-70 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="flex flex-col gap-8 text-2xl font-bold tracking-widest uppercase text-center mb-12">
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/home'); }} className="hover:opacity-70 transition-opacity">Home</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }} className="hover:opacity-70 transition-opacity">Destinations</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }} className="hover:opacity-70 transition-opacity">Contact</button>
        </div>
        <div className="flex gap-8 text-sm font-black tracking-widest uppercase text-[#888]">
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="hover:text-white transition-colors">Login</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="hover:text-white transition-colors">Register</button>
        </div>
      </div>

      {/* LEFT PANE - Image/Video */}
      <div className="hidden lg:block lg:w-[50%] xl:w-[55%] relative h-full bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      </div>

      {/* RIGHT PANE - Form */}
      <div className="w-full lg:w-[50%] xl:w-[45%] h-full flex flex-col pt-32 px-8 sm:px-16 md:px-24 lg:px-16 xl:px-24 relative overflow-y-auto">
        
        <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center pb-24">
          
          {/* Main Title Row */}
          <div className="flex items-center space-x-6 sm:space-x-10 mb-12">
            <Link to="/login" className="text-4xl sm:text-5xl font-normal tracking-tight flex items-center text-[#444] hover:text-[#888] transition-colors">
              <span className="w-3 h-3 rounded-full bg-[#444] mr-4"></span>
              Log in
            </Link>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight flex items-center">
              <span className="w-3 h-3 rounded-full bg-white mr-4"></span>
              Sign up
            </h1>
          </div>

          <div className="mb-8">
            <div className="flex mb-3 items-center justify-between text-xs font-semibold text-[#888]">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
              <div
                style={{ width: `${(step / 3) * 100}%` }}
                className="h-full bg-white transition-all duration-500 ease-out rounded-full"
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <input type="hidden" name="remember" defaultValue="true" />
            
            <div className="space-y-6 mb-8 min-h-[160px]">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="username" className="text-sm font-semibold mb-2 text-white/90">Username</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`w-full bg-transparent border ${errors.username ? 'border-red-500' : 'border-[#333]'} rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors`}
                      placeholder="Choose username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && <p className="mt-1.5 text-xs text-red-400">{errors.username}</p>}
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="Name" className="text-sm font-semibold mb-2 text-white/90">Full Name</label>
                    <input
                      id="Name"
                      name="Name"
                      type="text"
                      required
                      className={`w-full bg-transparent border ${errors.Name ? 'border-red-500' : 'border-[#333]'} rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors`}
                      placeholder="Enter full name"
                      value={formData.Name}
                      onChange={handleInputChange}
                    />
                    {errors.Name && <p className="mt-1.5 text-xs text-red-400">{errors.Name}</p>}
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="phno" className="text-sm font-semibold mb-2 text-white/90">Phone Number</label>
                    <div className="flex gap-2 relative">
                       <select
                        value={selectedCountryCode}
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                        className="w-[35%] bg-transparent border border-[#333] rounded-md px-2 py-3.5 text-white focus:outline-none focus:border-white transition-colors cursor-pointer appearance-none text-center"
                      >
                        <option className="bg-black text-white" value="+91">+91</option>
                        <option className="bg-black text-white" value="+1">+1</option>
                        <option className="bg-black text-white" value="+44">+44</option>
                        <option className="bg-black text-white" value="+61">+61</option>
                        <option className="bg-black text-white" value="+86">+86</option>
                        <option className="bg-black text-white" value="+81">+81</option>
                      </select>
                      <input
                        id="phno"
                        name="phno"
                        type="text"
                        required
                        className={`w-[65%] bg-transparent border ${errors.phno ? 'border-red-500' : 'border-[#333]'} rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors`}
                        placeholder="12345678"
                        value={formData.phno}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.phno && <p className="mt-1.5 text-xs text-red-400">{errors.phno}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="gmail" className="text-sm font-semibold mb-2 text-white/90">Email Address</label>
                    <input
                      id="gmail"
                      name="gmail"
                      type="email"
                      required
                      className={`w-full bg-transparent border ${errors.gmail ? 'border-red-500' : 'border-[#333]'} rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors`}
                      placeholder="Enter email"
                      value={formData.gmail}
                      onChange={handleInputChange}
                    />
                    {errors.gmail && <p className="mt-1.5 text-xs text-red-400">{errors.gmail}</p>}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col sm:col-span-2">
                    <label htmlFor="password" className="text-sm font-semibold mb-2 text-white/90">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className={`w-full bg-transparent border ${errors.password ? 'border-red-500' : 'border-[#333]'} rounded-md px-4 py-3.5 text-white placeholder-[#666] focus:outline-none focus:border-white transition-colors`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="role" className="text-sm font-semibold mb-2 text-white/90">Role Profile</label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        className="w-full bg-transparent border border-[#333] rounded-md px-4 py-3.5 text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option className="bg-black text-white" value="customer">Customer</option>
                        <option className="bg-black text-white" value="guide">Local Guide</option>
                        <option className="bg-black text-white" value="agency">Travel Agency</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="specialization" className="text-sm font-semibold mb-2 text-white/90">Specialization</label>
                    <div className="relative">
                      <select
                        id="specialization"
                        name="specialization"
                        className="w-full bg-transparent border border-[#333] rounded-md px-4 py-3.5 text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                        value={formData.specialization}
                        onChange={handleInputChange}
                      >
                        <option className="bg-black text-white" value="luxury">Luxury</option>
                        <option className="bg-black text-white" value="adventure">Adventure</option>
                        <option className="bg-black text-white" value="budget-friendly">Budget</option>
                        <option className="bg-black text-white" value="family">Family</option>
                        <option className="bg-black text-white" value="business">Business</option>
                        <option className="bg-black text-white" value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
            </div>

            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="w-1/3 bg-transparent border border-[#333] text-white font-bold py-4 rounded-md hover:border-white hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`${step > 1 ? 'w-2/3' : 'w-full'} bg-white text-black font-bold py-4 rounded-md hover:bg-gray-200 transition-colors`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${step > 1 ? 'w-2/3' : 'w-full'} bg-white text-black font-bold py-4 rounded-md hover:bg-gray-200 transition-colors`}
                >
                  Create Account
                </button>
              )}
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-16 text-xs text-[#888]">
            <p>Already registered? <Link to="/login" className="text-white hover:underline ml-1 font-semibold">Sign In Instead</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
