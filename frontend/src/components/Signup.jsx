import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    Name: "",
    phno: "",
    gmail: "",
    password: "",
    role: "customer",
    specialization: "luxury", // Default value for specialization
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
    validateField(name, value); // Validate on input change
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
          specialization: "luxury", // Reset to default value after submission
        });
        setErrors({});
        alert("Signup successful!");
        console.log("Signup successful!");
      } else {
        const data = await response.json();
        console.log("Signup failed with error:", data.error);
      }
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <div className="mb-4">
        <div className="relative pt-1">
          <div className="flex justify-between mb-2">
            <span>Step {step} of 3</span>
          </div>
          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${(step / 3) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className={`input input-bordered w-full ${
                  errors.username ? "border-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                required
                className={`input input-bordered w-full ${
                  errors.Name ? "border-red-500" : ""
                }`}
              />
              {errors.Name && (
                <p className="text-red-500 text-sm mt-1">{errors.Name}</p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phno"
                value={formData.phno}
                onChange={handleInputChange}
                required
                className={`input input-bordered w-full ${
                  errors.phno ? "border-red-500" : ""
                }`}
              />
              {errors.phno && (
                <p className="text-red-500 text-sm mt-1">{errors.phno}</p>
              )}
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="gmail"
                value={formData.gmail}
                onChange={handleInputChange}
                required
                className={`input input-bordered w-full ${
                  errors.gmail ? "border-red-500" : ""
                }`}
              />
              {errors.gmail && (
                <p className="text-red-500 text-sm mt-1">{errors.gmail}</p>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={`input input-bordered w-full ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              >
                <option value="customer">Customer</option>
                <option value="local-guide">Local Guide</option>
                <option value="travel-agency">Travel Agency</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label className="block text-gray-700">Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="input input-bordered w-full"
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

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Signup;
