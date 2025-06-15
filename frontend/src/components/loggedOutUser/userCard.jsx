import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import FollowButton from '../followComponent/followButton.jsx';
import { FiUsers, FiUserPlus } from 'react-icons/fi';

const UserCard = ({ user, onUserUpdate }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState(user.followers || []);
  const [following, setFollowing] = useState(user.following || []);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isRecruiter = currentUser?.role?.toLowerCase() === 'recruiter';
  const isUserRecruiter = user?.role?.toLowerCase() === 'recruiter';

  useEffect(() => {
    if (currentUser?._id && user) {
      const followingStatus = user.followers?.some(follower =>
        follower.toString() === currentUser._id.toString()
      );
      setIsFollowing(followingStatus);
      setFollowers(user.followers || []);
      setFollowing(user.following || []);
    }
    setLoading(false);
  }, [currentUser?._id, user]);

  if (!user || !user._id || currentUser?._id === user._id) {
    return (
      <div className="border rounded-md p-4 bg-gray-100 animate-pulse w-full">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleFollowSuccess = (newStatus) => {
    if (!currentUser || !currentUser._id) return;

    setIsFollowing(newStatus);
    setFollowers(prev =>
      newStatus
        ? [...prev, currentUser._id]
        : prev.filter(id => id.toString() !== currentUser._id.toString())
    );

    onUserUpdate?.();
  };

  const handleViewProfile = () => navigate(`/profile/${user._id}`);

  const handleSkillExchange = () => navigate(`/skill-exchange`, {
    state: {
      recipientId: user._id,
      recipientName: user.name,
      recipientSkills: user.skills || []
    }
  });

  const handleHireClick = () => navigate(`/hire/${user._id}`, {
    state: {
      recipientName: user.name,
      recipientRole: user.role,
      recipientSkills: user.skills
    }
  });

  const handleMentorClick = () => navigate(`/mentor/${user._id}`, {
    state: {
      mentorName: user.name,
      mentorRole: user.role,
      mentorSkills: user.skills
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4 relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <img
          src={user.image}
          alt={user.name}
          className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
        />
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.bio || 'No bio available'}</p>
          {user.role && (
            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded 
              ${user.role.toLowerCase() === 'recruiter' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Follow stats */}
      {!isUserRecruiter && (
        <div className="absolute top-4 right-4 bg-blue-50 text-xs font-medium text-blue-700 px-3 py-1 rounded flex items-center gap-2">
          <span className="hidden sm:inline">Followers:</span>
          <FiUsers className="sm:hidden" />
          <span>{followers.length}</span>
          <span className="hidden sm:inline">| Following:</span>
          <FiUserPlus className="sm:hidden" />
          <span>{following.length}</span>
        </div>
      )}

      {/* Skills (only for recruiters) */}
      {user.skills?.length > 0 && isUserRecruiter && (
        <div className="mb-3">
          <p className="text-sm text-gray-500 font-medium">Skills:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {user.skills.map((skill, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end mt-3">
        <button
          onClick={handleViewProfile}
          className="px-4 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
        >
          View Profile
        </button>

        {currentUser?._id !== user._id && (
          <>
            {!isUserRecruiter && !isRecruiter && (
              <button
                onClick={handleSkillExchange}
                disabled={!user.skills?.length}
                className="px-4 py-1.5 text-sm rounded-md bg-yellow-100 hover:bg-yellow-200 text-yellow-800 disabled:opacity-50"
              >
                Exchange
              </button>
            )}

            {isRecruiter && !isUserRecruiter && (
              <button
                onClick={handleHireClick}
                className="px-4 py-1.5 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
              >
                Hire
              </button>
            )}

            {currentUser?.role === 'learner' && user?.role === 'mentor' && (
              <button
                onClick={handleMentorClick}
                className="px-4 py-1.5 text-sm rounded-md bg-sky-600 hover:bg-sky-700 text-white"
              >
                Take Mentorship
              </button>
            )}

            {!isUserRecruiter && (
              <FollowButton
                targetUserId={user._id}
                isFollowing={isFollowing}
                onFollowChange={handleFollowSuccess}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserCard;
