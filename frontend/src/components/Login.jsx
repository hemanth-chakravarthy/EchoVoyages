import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [adminError, setAdminError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

        if (data.role === "customer") {
          navigate("/realhome");
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

  const handleAdminLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/customers/adminlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminCredentials),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAdminModalOpen(false);
        navigate("/admin");
      } else {
        setAdminError(data.error || "Invalid admin credentials.");
      }
    } catch (err) {
      console.error("Error during admin login:", err);
      setAdminError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('../public/images/travel-background.jpg')" }}>
      <div className="max-w-md w-full space-y-8 bg-gray-900 bg-opacity-80 p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Continue your journey with us
          </p>
        </div>

        {errors.login && (
          <div className="bg-red-500 bg-opacity-10 border border-red-400 text-red-300 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errors.login}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>

            <div className="flex flex-col space-y-2">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-300 hover:text-indigo-200 text-center"
              >
                Forgot your password?
              </Link>

              <div className="text-center mt-2">
                <span className="text-gray-400">Don't have an account? </span>
                <Link
                  to="/signup"
                  className="text-sm text-indigo-300 hover:text-indigo-200"
                >
                  Sign up here
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-300 bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Admin Login
            </button>
          </div>
        </form>

        {isAdminModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
              {adminError && (
                <div className="bg-red-500 bg-opacity-10 border border-red-400 text-red-300 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">{adminError}</span>
                </div>
              )}
              <div className="space-y-4">
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
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <div className="flex justify-between space-x-4 mt-6">
                  <button
                    onClick={handleAdminLogin}
                    className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsAdminModalOpen(false)}
                    className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-300 bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;