import React, { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const {  setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistred] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (registered) {
      console.log("use effect working");

      navigate("/");
    }
  }, [registered]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      setLoading(true);
      const res = await authApi.register(formData);
      setRegistred(true);
      console.log(res?.data);

      if (res?.data?.user) {
        setUser(res.data.user);
        console.log(res?.data?.user);
      }
    } catch (error) {
      setLoading(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Continue with Google clicked");
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Artistic Background Elements */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-900 to-green-800 rounded-2xl blur-lg opacity-30"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        {/* Main Card */}
        <div className="relative bg-gray-800 rounded-2xl shadow-2xl border border-emerald-900/50 overflow-hidden">
          {/* Header */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Join sasta spotify
              </h1>
              <p className="text-emerald-200">
                Start your artistic journey today
              </p>
            </div>

            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition duration-200 mb-6 border border-gray-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-600"></div>
              <div className="px-3 text-gray-400 text-sm">
                or sign up with email
              </div>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-emerald-200 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-emerald-200 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="Create a password"
                  required
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-emerald-200 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition duration-200 ${
                      formData.role === "user"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-gray-600 bg-gray-700 text-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium">User</span>
                  </label>
                  <label
                    className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition duration-200 ${
                      formData.role === "artist"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-gray-600 bg-gray-700 text-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="artist"
                      checked={formData.role === "artist"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium">Artist</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {loading ? "loading..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition duration-200"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
