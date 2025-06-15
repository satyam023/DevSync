import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

function HomePage() {
  return (
    <div className="bg-sky-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 bg-gradient-to-r from-sky-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome back to <span className="text-gray-800">devSync</span>
          </h1>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto mb-6">
            Continue your journey with the developer community
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center bg-white text-sky-600 font-medium text-md px-6 py-2.5 rounded-full shadow-md hover:bg-sky-50 hover:shadow-lg transition duration-200"
          >
            Go to Dashboard
            <ArrowForwardIcon className="ml-2" fontSize="small" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-sky-700 mb-3">
            What can you do on DevSync?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your platform for connecting and growing in the tech community
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-lg border border-sky-100 p-5 hover:shadow-sm transition">
            <div className="flex items-start mb-3">
              <div className="bg-sky-100 p-2 rounded-lg mr-4">
                <span className="text-sky-600 text-xl">🧑‍🏫</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sky-700">Mentor Hub</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Connect with mentors or guide learners in your expertise
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-sky-100 p-5 hover:shadow-sm transition">
            <div className="flex items-start mb-3">
              <div className="bg-sky-100 p-2 rounded-lg mr-4">
                <span className="text-sky-600 text-xl">💼</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sky-700">Career Network</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Explore opportunities or find talent for your team
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-sky-100 p-5 hover:shadow-sm transition">
            <div className="flex items-start mb-3">
              <div className="bg-sky-100 p-2 rounded-lg mr-4">
                <span className="text-sky-600 text-xl">🤝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sky-700">Collaborate</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Work on projects with developers worldwide
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-sky-100 p-5 hover:shadow-sm transition">
            <div className="flex items-start mb-3">
              <div className="bg-sky-100 p-2 rounded-lg mr-4">
                <span className="text-sky-600 text-xl">🔍</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sky-700">Trusted Network</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Verified profiles and secure connections
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;