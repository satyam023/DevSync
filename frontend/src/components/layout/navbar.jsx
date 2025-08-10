import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef();

  const isRecruiter = user?.role === "recruiter";

  const navLinks = user
    ? [
        { text: "Home", path: "/home" },
        !isRecruiter && { text: "Mentor", path: "/mentor" },
        !isRecruiter && { text: "Learner", path: "/learner" },
        { text: "Developer", path: "/developer" },
        { text: "All Posts", path: "/posts" },
        { text: "Dashboard", path: "/dashboard" },
        {
          text: "Logout",
          action: async () => {
            await logout();
            setIsOpen(false);
          },
        },
      ].filter(Boolean)
    : [
        { text: "Login", path: "/login" },
        { text: "Signup", path: "/signup" },
      ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <nav className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md h-30sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-400 text-transparent bg-clip-text cursor-pointer drop-shadow-sm"
          >
            DevSync
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((link, idx) =>
              link.action ? (
                <button
                  key={idx}
                  onClick={link.action}
                  className={`hover:text-sky-400 font-medium ${
                    isActive(link.path) ? "text-sky-400 underline" : ""
                  }`}
                >
                  {link.text}
                </button>
              ) : (
                <Link
                  key={idx}
                  to={link.path}
                  className={`hover:text-sky-400 font-medium ${
                    isActive(link.path) ? "text-sky-400 underline" : ""
                  }`}
                >
                  {link.text}
                </Link>
              )
            )}
          </div>

          {/* Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm">
          <div
            ref={drawerRef}
            className="fixed right-0 top-0 h-full w-72 bg-white text-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="text-lg font-semibold text-sky-600">Menu</div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link, idx) =>
                link.action ? (
                  <button
                    key={idx}
                    onClick={link.action}
                    className={`text-left w-full px-2 py-2 rounded hover:bg-sky-100 ${
                      isActive(link.path) ? "text-sky-600 font-semibold" : ""
                    }`}
                  >
                    {link.text}
                  </button>
                ) : (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full px-2 py-2 rounded hover:bg-sky-100 ${
                      isActive(link.path) ? "text-sky-600 font-semibold" : ""
                    }`}
                  >
                    {link.text}
                  </Link>
                )
              )}

              <div className="pt-2 text-sm text-gray-500 border-t border-gray-200">
                {user ? `Logged in as ${user.name}` : "Not logged in"}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
