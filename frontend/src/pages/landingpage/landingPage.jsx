import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import {
  Code, Group, School, Security, EmojiObjects, SupportAgent, Rocket,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen w-full">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to <span className="text-blue-600">DevSync</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-6">
          A modern platform for <strong>learning</strong>, <strong>collaborating</strong>, and <strong>building</strong> together
          <Link to="/learn-more" className="ml-2 text-blue-600 underline hover:text-blue-800">
            Learn More
          </Link>
        </p>

        {/* Buttons Section (fixed for mobile view) */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Rocket fontSize="small" /> Get Started
            </button>
          </Link>
          <Link to="/signup" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto border border-blue-600 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-lg font-semibold">
              Create Account
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose DevSync?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Code fontSize="large" />,
                title: 'Code Collaboration',
                description: 'Collaborate with your team in real time',
              },
              {
                icon: <Group fontSize="large" />,
                title: 'Community Support',
                description: 'Join and grow with global developers',
              },
              {
                icon: <School fontSize="large" />,
                title: 'Learning Resources',
                description: 'Explore curated tutorials and hands-on projects',
              },
              {
                icon: <Security fontSize="large" />,
                title: 'Secure Environment',
                description: 'Your code and data stay fully protected',
              },
              {
                icon: <EmojiObjects fontSize="large" />,
                title: 'Innovative Tools',
                description: 'Boost productivity with modern dev tools',
              },
              {
                icon: <SupportAgent fontSize="large" />,
                title: '24/7 Support',
                description: 'Expert help available anytime you need',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-xl transition duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 text-center bg-blue-100">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Join Our Developer Community?
        </h2>
        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
          Thousands of developers are already building amazing projects on DevSync.
        </p>
        <Link to="/signup">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
            Sign Up Free
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
