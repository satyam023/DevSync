import { useParams, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import { Avatar, CircularProgress, Chip } from '@mui/material';

const UserProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const capitalizeFirstSentence = (str) => {
    if (!str) return '';
    str = str.trim().replace(/\s+/g, ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setUserProfile(data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <CircularProgress />
      </div>
    );
  }

  if (!userProfile) {
    return <p className="text-center text-red-600">User not found</p>;
  }

  const normalizedRates = {
    mentor: userProfile.mentorRate || userProfile.rates?.mentor || 0,
    developer: userProfile.developerRate || userProfile.rates?.developer || 0,
  };

  const roleKey = userProfile.role?.toLowerCase();
  const isProfileTab = location.pathname === `/profile/${id}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 min-h-screen overflow-y-auto">
      {/* Profile Header */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/profile/${id}`)}
            className={`px-4 py-2 rounded-full font-semibold transition ${isProfileTab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => navigate(`/profile/${id}/posts`)}
            className={`px-4 py-2 rounded-full font-semibold transition ${!isProfileTab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Posts
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
        <div className="relative">
          <Avatar
            src={userProfile.image}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid #3b82f6'
            }}
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-semibold">{userProfile.name}</h1>
          <p className="text-gray-600 italic">
            {capitalizeFirstSentence(userProfile.bio) || 'No bio provided'}
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="mt-4">
        <Outlet />

        {isProfileTab && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {/* Basic Info */}
            <div className="bg-white shadow rounded-xl p-5 overflow-auto">
              <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
              <hr className="mb-3" />
              <p><span className="font-medium">Gender:</span> {userProfile.gender || 'Not specified'}</p>
              <p><span className="font-medium">Role:</span> {userProfile.role ? capitalizeFirstSentence(userProfile.role) : 'Learner'}</p>
              <p><span className="font-medium">Joined:</span> {new Date(userProfile.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Professional Details */}
            <div className="bg-white shadow rounded-xl p-5 overflow-auto">
              <h2 className="text-lg font-semibold mb-2">Professional Details</h2>
              <hr className="mb-3" />
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills?.length > 0 ? (
                    userProfile.skills.map((skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills listed</span>
                  )}
                </div>
              </div>
              {normalizedRates[roleKey] > 0 && (
                <p>
                  <span className="font-medium">Rate:</span> ₹{normalizedRates[roleKey]} /{' '}
                  {roleKey === 'mentor' ? 'month' : 'project'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
