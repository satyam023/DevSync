import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import ProfileTab from './profileTab.jsx';
import ConnectionsTab from './connectionTab.jsx';
import PostComponent from '../posts/postComponent.jsx';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const isRecruiter = user.role?.toLowerCase() === 'recruiter';

  return (
    <div className="max-w-6xl mx-auto  bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
      {/* Removed the card wrapper */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
        Welcome, {user.name || user.email}
      </h1>

      <div className="flex justify-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => { setActiveTab(0); setShowCreate(false); }}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Profile
          </button>
          {!isRecruiter && (
            <button
              onClick={() => { setActiveTab(1); setShowCreate(false); }}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeTab === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Network & Posts
            </button>
          )}
        </div>
      </div>

      <div className="transition-all duration-500">
        {activeTab === 0 && <ProfileTab user={user} />}

        {!isRecruiter && activeTab === 1 && (
          <div className="space-y-6">
            <ConnectionsTab user={user} />
            <div className="text-center">
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
              >
                {showCreate ? 'Cancel' : 'Create Post'}
              </button>
            </div>
            <div>
              {showCreate ? (
                <PostComponent mode="create" onPostCreated={() => setShowCreate(false)} />
              ) : (
                <PostComponent mode="list" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
