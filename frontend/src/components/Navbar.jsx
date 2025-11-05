import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi.js";
import { useUser } from "../context/UserContext.jsx";
import toast from "react-hot-toast";
const Navbar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray-900 w-full px-6 py-4 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Name */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-sm">M</span>
          </div>
          <span className="text-xl font-semibold text-white">mybrand</span>
        </div>

        {/* Settings Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* Settings Button */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-2xl bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-all duration-200 shadow-md active:scale-95"
          >
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 w-48 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 py-2 z-50 animate-in fade-in-0 zoom-in-95">
              {/* Upload Music Option (Conditional) */}
              {user?.role === "artist" && (
                <button
                  className="w-full px-4 py-3 text-left text-gray-200 hover:bg-green-600/20 active:bg-green-600/30 transition-all duration-150 flex items-center space-x-3 group"
                  onClick={() => {
                    navigate("/upload-music");
                  }}
                >
                  <svg
                    className="w-5 h-5 text-green-400 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="group-hover:text-green-400 transition-colors duration-200">
                    Upload Music
                  </span>
                </button>
              )}
              {/* Home Option */}
              <button
                className="w-full px-4 py-3 text-left text-gray-200 hover:bg-green-600/20 active:bg-green-600/30 transition-all duration-150 flex items-center space-x-3 group border-t border-gray-700"
                onClick={() => {
                  navigate("/");
                }}
              >
                <svg
                  className="w-5 h-5 text-green-400 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="group-hover:text-green-400 transition-colors duration-200">
                  Home
                </span>
              </button>

              {/* Logout Option */}
              <button
                className="w-full px-4 py-3 text-left text-gray-200 hover:bg-green-600/20 active:bg-green-600/30 transition-all duration-150 flex items-center space-x-3 group border-t border-gray-700"
                onClick={async () => {
                  try {
                    await authApi.logout();
                    navigate("/login");
                    setUser(null);
                    toast.success("👋 Logged out. Have a great day!");
                  } catch (error) {
                    console.log("error while logging out ", error);
                  }
                }}
              >
                <svg
                  className="w-5 h-5 text-green-400 group-hover:scale-110 group-hover:translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="group-hover:text-green-400 transition-colors duration-200">
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Example usage with different user roles:
// <Navbar user={{ role: "artist" }} />  // Shows upload option
// <Navbar user={{ role: "listener" }} /> // Hides upload option
// <Navbar user={null} /> // Hides upload option

export default Navbar;
