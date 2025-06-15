import React from 'react';
import DeleteAccountButton from './deleteAccountButton.jsx';
import SkillExchangeRequests from './skillExchangeRequest.jsx';
import MentorshipStatusCard from '../../components/mentors/mentorsCard.jsx';
import HiringStatusCard from '../../components/hiring/hiringStatusCard.jsx'
import { FaUserAlt } from 'react-icons/fa';

const ProfileTab = ({ user }) => {
  if (!user) return <p className="text-red-500 p-4">User data not available</p>;

  const isRecruiter = user.role?.toLowerCase() === 'recruiter';
  const isDeveloper = user.role?.toLowerCase() === 'developer';

  const normalizedRates = {
    mentor: user.mentorRate || user.rates?.mentor || 0,
    developer: user.developerRate || user.rates?.developer || 0
  };

  const roleKey = user.role?.toLowerCase();

  const skillsArray = Array.isArray(user.skills)
    ? user.skills
    : user.skills?.split(',')?.map(s => s.trim()).filter(Boolean) || [];

  const capitalizeFirstSentence = str =>
    str ? str.trim().replace(/\s+/g, ' ').replace(/^./, m => m.toUpperCase()) : '';

  return (
    <div className="min-h-screen  px-4 py-6 md:px-6 space-y-6 max-w-screen-xl mx-auto w-full">

      {/* ========== Profile Header Card ========== */}
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 w-full">
        <img
          src={user.image}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-md"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{user.name || 'Unnamed User'}</h2>
          <p className="text-sm text-blue-600">{capitalizeFirstSentence(user.role) || 'Learner'}</p>
          <p className="text-sm text-gray-500 mt-1">{capitalizeFirstSentence(user.bio)}</p>
        </div>
      </div>

      {/* ========== Basic & Professional Info ========== */}
      <div className={`grid grid-cols-1 ${isRecruiter ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6`}>

        {/* Basic Info */}
        <div className="bg-white shadow-md rounded-xl p-5 space-y-2 w-full">
          <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
            <FaUserAlt /> Basic Information
          </h3>
          <hr />
          <p><span className="font-semibold">Email:</span> {user.email || 'Not provided'}</p>
          <p><span className="font-semibold">Gender:</span> {user.gender || 'Other'}</p>
          <p><span className="font-semibold">Role:</span> {capitalizeFirstSentence(user.role) || 'Learner'}</p>
        </div>

        {/* Professional Info */}
        {!isRecruiter && (
          <div className="bg-white shadow-md rounded-xl p-5 space-y-2 w-full">
            <h3 className="text-lg font-bold text-blue-700">Professional Details</h3>
            <hr />
            <div className="flex flex-wrap gap-2">
              {skillsArray.length > 0 ? (
                skillsArray.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full shadow-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills listed</p>
              )}
            </div>
            {(roleKey === 'mentor' || roleKey === 'developer') && (
              <p className="text-sm text-gray-600">
                Rate:{" "}
                <span className="font-bold text-gray-800">
                  {normalizedRates[roleKey] > 0
                    ? `₹${normalizedRates[roleKey]}/${roleKey === 'mentor' ? 'month' : 'project'}`
                    : 'Not specified'}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* ========== Skill Exchange Section ========== */}
      {!isRecruiter && (
        <>
          <h3 className="text-lg font-bold text-blue-700 mb-1">Skill Exchange</h3>
          <SkillExchangeRequests userId={user._id} />
        </>
      )}

      {/* ========== Mentorship Status Section ========== */}
      {(roleKey === 'mentor' || roleKey === 'learner') && (
        <>
          <h3 className="text-lg font-bold text-blue-700 mb-1">Mentorship Status</h3>
          <MentorshipStatusCard user={user} />
        </>
      )}

      {/* ✅ Hiring Status for Recruiter */}
      {(roleKey === 'recruiter' || roleKey === 'developer' ) && (
        <>
          <h3 className="text-lg font-bold text-blue-700 mb-1">Hiring Status</h3>
          <HiringStatusCard user={user} />
        </>
      )}

      {/* ========== Danger Zone Section ========== */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-red-200 w-full">
        <h3 className="text-lg font-bold text-red-600 mb-3">Danger Zone</h3>
        <DeleteAccountButton />
      </div>
    </div>
  );
};

export default ProfileTab;
