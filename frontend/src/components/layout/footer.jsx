// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Footer = () => {
  const { user } = useAuth(); // ✅ Hook called inside component
  const isLoggedIn = !!user;

  return (
    <footer className="bg-gray-100 text-gray-600 py-10">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Logo / About */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-gray-800">DevSync</h2>
          <p className="text-sm text-gray-500">
            A modern platform to learn, collaborate, and build — empowering
            learners, mentors, and recruiters to connect and grow together.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-800">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to={isLoggedIn ? "/home" : "/"}
                className="hover:text-gray-800 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/learn-more"
                className="hover:text-gray-800 transition-colors"
              >
                About Us
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    to="/mentor"
                    className="hover:text-gray-800 transition-colors"
                  >
                    Mentors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/learner"
                    className="hover:text-gray-800 transition-colors"
                  >
                    Learners
                  </Link>
                </li>
                <li>
                  <Link
                    to="/developer"
                    className="hover:text-gray-800 transition-colors"
                  >
                    Developers
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-gray-800 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-800">
            Follow Us
          </h3>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=100025020096708"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-500"
            >
              Instagram
            </a>
            <a
              href="https://github.com/satyam023"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/satyam023/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-500"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Made by Satyam Pandey. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
