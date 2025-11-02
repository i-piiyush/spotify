import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='bg-gray-900 w-full px-6 py-4 text-white shadow-lg'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        {/* Brand Name */}
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md'>
            <span className='font-bold text-white text-sm'>M</span>
          </div>
          <span className='text-xl font-semibold text-white'>mybrand</span>
        </div>

        {/* Settings Dropdown */}
        <div className='relative' ref={dropdownRef}>
          {/* Settings Button */}
          <button
            onClick={handleSettingsClick}
            className='p-2 rounded-2xl bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-all duration-200 shadow-md active:scale-95'
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
            <div className='absolute right-0 top-12 w-48 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 py-2 z-50 animate-in fade-in-0 zoom-in-95'>
              {/* Upload Music Option (Conditional) */}
              {user?.role === "artist" && (
                <button className='w-full px-4 py-3 text-left text-gray-200 hover:bg-green-600/20 active:bg-green-600/30 transition-all duration-150 flex items-center space-x-3 group' onClick={()=>{
                  navigate("/upload-music")
                }}>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className='group-hover:text-green-400 transition-colors'>Upload Music</span>
                </button>
              )}
              
              {/* Profile Option */}
              <button className='w-full px-4 py-3 text-left text-gray-200 hover:bg-green-600/20 active:bg-green-600/30 transition-all duration-150 flex items-center space-x-3 group border-t border-gray-700' onClick={()=>{
                navigate("/")
              }}>
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className='group-hover:text-green-400 transition-colors'>Home</span>
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