import React, { useState, useEffect } from 'react';
import {
  People as FollowersIcon,
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon
} from '@mui/icons-material';
import API from '../../utils/axios';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const ConnectionsTab = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followersExpanded, setFollowersExpanded] = useState(false);
  const [followingExpanded, setFollowingExpanded] = useState(false);

  const fetchConnections = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const [followersRes, followingRes] = await Promise.all([
        API.get(`/users/${user._id}/followers`, { withCredentials: true }),
        API.get(`/users/${user._id}/following`, { withCredentials: true }),
      ]);

      const fetchedFollowers = followersRes.data.followers || [];
      const fetchedFollowing = followingRes.data.following || [];

      const followersWithStatus = fetchedFollowers.map(f => ({
        ...f,
        isFollowing: fetchedFollowing.some(u => u._id === f._id),
      }));

      setFollowers(followersWithStatus);
      setFollowing(fetchedFollowing);
    } catch (err) {
      console.error('Error fetching connections:', err);
      enqueueSnackbar('Failed to load connections', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId, currentlyFollowing) => {
    try {
      await API.post(`/users/follow/${targetUserId}`, {}, { withCredentials: true });

      enqueueSnackbar(
        currentlyFollowing ? 'Unfollowed successfully' : 'Followed successfully',
        { variant: 'success' }
      );

      setFollowers(prev =>
        prev.map(u =>
          u._id === targetUserId ? { ...u, isFollowing: !currentlyFollowing } : u
        )
      );

      if (currentlyFollowing) {
        setFollowing(prev => prev.filter(u => u._id !== targetUserId));
      } else {
        const followedUser = followers.find(u => u._id === targetUserId);
        if (followedUser) {
          setFollowing(prev => [...prev, { ...followedUser, isFollowing: true }]);
        }
      }
    } catch (err) {
      console.error('Follow toggle failed:', err);
      enqueueSnackbar('Failed to update follow status', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchConnections();

    let refreshCount = 0;
    const maxRefreshes = 1;
    const interval = setInterval(() => {
      if (++refreshCount > maxRefreshes) return clearInterval(interval);
      fetchConnections();
    }, 3000);

    return () => clearInterval(interval);
  }, [user]);

  const renderUser = (u, isFromFollowingList = false) => {
    if (u.role === 'recruiter') return null;
    const isSelf = u._id === user._id;
    const isFollowing = isFromFollowingList || u.isFollowing;

    return (
      <li
        key={u._id}
        className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg mb-1"
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${u._id}`)}>
          <img
            src={u.image || ''}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover bg-purple-300"
          />
          <div>
            <p className="font-medium text-sm text-gray-900">{u.name || 'Unknown User'}</p>
            {['mentor', 'developer', 'learner'].includes(u.role) && (
              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-[2px] rounded-full">
                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
              </span>
            )}
          </div>
        </div>

        {!isSelf && (
          <button
            onClick={() => handleFollowToggle(u._id, isFollowing)}
            className={`text-xs px-3 py-1 font-medium rounded-full border transition ${isFollowing
              ? 'text-red-600 border-red-500 hover:bg-red-100'
              : 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700'
              }`}
          >
            {isFollowing ? (
              <span className="flex items-center gap-1">
                <UnfollowIcon fontSize="small" /> Unfollow
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <FollowIcon fontSize="small" /> Follow
              </span>
            )}
          </button>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Loading connections...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6">My Network</h2>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Followers Card */}
        <div className="bg-white shadow-md rounded-xl p-4 w-full md:w-1/2">
          <div
            className="flex items-center cursor-pointer mb-2"
            onClick={() => setFollowersExpanded(prev => !prev)}
          >
            <FollowersIcon className="text-blue-500 mr-2" />
            <p className="font-medium">
              Followers ({followers.length}) {followersExpanded ? '▲' : '▼'}
            </p>
          </div>
          <hr className="mb-3" />
          {followersExpanded && (
            <ul className="space-y-2 mt-2 transition-all duration-300 ease-in-out">
              {followers.length > 0 ? (
                followers.map(u => renderUser(u))
              ) : (
                <li className="text-center text-sm text-gray-500 py-2">No followers yet</li>
              )}
            </ul>
          )}
        </div>

        {/* Following Card */}
        <div className="bg-white shadow-md rounded-xl p-4 w-full md:w-1/2">
          <div
            className="flex items-center cursor-pointer mb-2"
            onClick={() => setFollowingExpanded(prev => !prev)}
          >
            <FollowersIcon className="text-purple-500 mr-2" />
            <p className="font-medium">
              Following ({following.length}) {followingExpanded ? '▲' : '▼'}
            </p>
          </div>
          <hr className="mb-3" />
          {followingExpanded && (
            <ul className="space-y-2 mt-2 transition-all duration-300 ease-in-out">
              {following.length > 0 ? (
                following.map(u => renderUser(u, true))
              ) : (
                <li className="text-center text-sm text-gray-500 py-2">Not following anyone yet</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsTab;
