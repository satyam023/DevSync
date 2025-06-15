import React from 'react';
import { Link } from 'react-router-dom';
import { EmojiPeople, RocketLaunch, Groups, School } from '@mui/icons-material';

const LearnMorePage = () => {
  const features = [
    {
      icon: <EmojiPeople fontSize="inherit" className="text-blue-600 w-8 h-8" />,
      title: "Expert Mentors",
      description: "Learn from professionals with 5+ years at top tech companies. Get 1:1 guidance tailored to your goals."
    },
    {
      icon: <RocketLaunch fontSize="inherit" className="text-blue-600 w-8 h-8" />,
      title: "Project-Based Learning",
      description: "Build real applications using modern tech stacks that employers actually want to see."
    },
    {
      icon: <School fontSize="inherit" className="text-blue-600 w-8 h-8" />,
      title: "Structured Paths",
      description: "Follow our proven curriculum designed by industry experts to maximize your learning efficiency."
    },
    {
      icon: <Groups fontSize="inherit" className="text-blue-600 w-8 h-8" />,
      title: "Peer Community",
      description: "Collaborate with fellow learners in our active community for code reviews and networking."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-500 text-transparent bg-clip-text mb-4">
          Launch Your Tech Career
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          The most effective way to gain in-demand skills and land your dream tech job.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center bg-gradient-to-r from-gray-100 to-blue-50 rounded-xl p-6 mb-16">
        <div>
          <p className="text-3xl font-bold text-blue-600">12,000+</p>
          <p className="text-gray-600">Graduates</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">94%</p>
          <p className="text-gray-600">Job Placement Rate</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">6–9</p>
          <p className="text-gray-600">Months to Career Ready</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Our Proven Approach</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center px-4">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-gray-500 mt-2 max-w-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <Link
          to="/signup"
          className="inline-block bg-gradient-to-r from-blue-700 to-cyan-500 text-white text-lg px-6 py-2 rounded-full hover:opacity-90 transition"
        >
          Apply Now
        </Link>
        <p className="text-gray-500 text-sm mt-2">No commitment • Get started in minutes</p>
      </div>
    </div>
  );
};

export default LearnMorePage;
