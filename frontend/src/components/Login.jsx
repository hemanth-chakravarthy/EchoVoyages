import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // State for admin modal visibility and credentials
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [adminError, setAdminError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username || !formData.password) {
      setErrors({ login: "Username and password are required." });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        // Redirect based on the role provided in the response
        if (data.role === "customer") {
          navigate("/home");
        } else if (data.role === "agency") {
          navigate("/AgentHome");
        } else if (data.role === "guide") {
          navigate("/guideHome");
        } else {
          setErrors({ login: "Unknown user role" });
        }
      } else {
        const data = await response.json();
        setErrors({ login: data.msg || "Login failed." });
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setErrors({ login: "Server error. Please try again later." });
    }
  };

  // Handle admin login
  const handleAdminLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/customers/adminlogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminCredentials),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsAdminModalOpen(false);
        navigate("/admin"); // Navigate to the admin dashboard
      } else {
        setAdminError(data.error || "Invalid admin credentials.");
      }
    } catch (err) {
      console.error("Error during admin login:", err);
      setAdminError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-6 bg-base-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
        {errors.login && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.login}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-group">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-base-300 text-black font-bold py-2 rounded hover:bg-base-200 transition"
          >
            Log In
          </button>
        </form>
        <Link
          to="/forgot-password"
          className="block text-blue-500 mt-4 text-center"
        >
          Forgot Password?
        </Link>

        {/* Admin Login Button */}
        <button
          className="w-full mt-4 bg-base-300 text-black font-bold py-2 rounded hover:bg-base-200 transition"
          onClick={() => setIsAdminModalOpen(true)}
        >
          Admin Login
        </button>

        {/* Admin Login Modal */}
        {isAdminModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
              {adminError && (
                <p className="text-red-500 text-sm mb-4">{adminError}</p>
              )}
              <input
                type="text"
                placeholder="Admin Username"
                value={adminCredentials.username}
                onChange={(e) =>
                  setAdminCredentials({
                    ...adminCredentials,
                    username: e.target.value,
                  })
                }
                className="input input-bordered w-full mb-2"
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={adminCredentials.password}
                onChange={(e) =>
                  setAdminCredentials({
                    ...adminCredentials,
                    password: e.target.value,
                  })
                }
                className="input input-bordered w-full mb-4"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleAdminLogin}
                  className="bg-base-300 text-black font-bold py-2 px-4 rounded hover:bg-base-200 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="bg-base-300 text-black font-bold py-2 px-4 rounded hover:bg-base-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
