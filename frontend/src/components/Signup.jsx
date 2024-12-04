import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    Name: "",
    phno: "",
    gmail: "",
    password: "",
    role: "customer",
    specialization: "luxury",
  });

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
    const usernamePattern = /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+-=]*$/;
    return usernamePattern.test(username)
      ? ""
      : "Username must start with an alphabet and can include letters, numbers, and special characters.";
  };

  const validateName = (name) => {
    const namePattern = /^[a-zA-Z\s]*$/;
    return namePattern.test(name)
      ? ""
      : "Name must not contain digits or special characters.";
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? "" : 'Email must contain "@" and "."';
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

  const validatePhoneNumber = (phno) => {
    const phoneNumberPattern = /^[0-9]{10}$/;
    return phoneNumberPattern.test(phno)
      ? ""
      : "Phone number must be exactly 10 digits";
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

    try {
      const response = await fetch("http://localhost:5000/customers/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
        navigate('/login')
        console.log("Signup successful!");
      } else {
        const data = await response.json();
        console.log("Signup failed with error:", data.error);
        toast.error(`Signup failed with error: ${data.error}`)
      }
    } catch (err) {
      console.error("Error signing up:", err);
      toast.error(`Error:${err}`)
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('../public/images/travel-background.jpg')" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-md w-full space-y-8 bg-gray-900 bg-opacity-80 p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Start your journey with us
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="relative">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-300 bg-indigo-900">
                  Step {step} of 3
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-300">
                  {Math.round((step / 3) * 100)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-900">
              <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              {step === 1 && (
                <>
                  <div className="mb-4">
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                        errors.username ? "border-red-500" : "border-gray-700"
                      } bg-gray-800 text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-400" id="email-error">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="Name" className="sr-only">
                      Name
                    </label>
                    <input
                      id="Name"
                      name="Name"
                      type="text"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                        errors.Name ? "border-red-500" : "border-gray-700"
                      } bg-gray-800 text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                    />
                    {errors.Name && (
                      <p className="mt-2 text-sm text-red-400" id="email-error">
                        {errors.Name}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label htmlFor="phno" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      id="phno"
                      name="phno"
                      type="text"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                        errors.phno ? "border-red-500" : "border-gray-700"
                      } bg-gray-800 text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Phone Number"
                      value={formData.phno}
                      onChange={handleInputChange}
                    />
                    {errors.phno && (
                      <p className="mt-2 text-sm text-red-400" id="email-error">
                        {errors.phno}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="gmail" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="gmail"
                      name="gmail"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                        errors.gmail ? "border-red-500" : "border-gray-700"
                      } bg-gray-800 text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Email address"
                      value={formData.gmail}
                      onChange={handleInputChange}
                    />
                    {errors.gmail && (
                      <p className="mt-2 text-sm text-red-400" id="email-error">
                        {errors.gmail}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="mb-4">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-700"
                      } bg-gray-800 text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-400" id="password-error">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="role" className="sr-only">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="customer">Customer</option>
                      <option value="guide">Local Guide</option>
                      <option value="travel-agency">Travel Agency</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="specialization" className="sr-only">
                      Specialization
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      value={formData.specialization}
                      onChange={handleInputChange}
                    >
                      <option value="luxury">Luxury</option>
                      <option value="adventure">Adventure</option>
                      <option value="budget">Budget-Friendly</option>
                      <option value="family">Family</option>
                      <option value="business">Business</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-300 bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

