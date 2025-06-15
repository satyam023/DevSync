import React, { useState } from 'react';
import API from '../../utils/axios.jsx';
import { useAuth } from '../../context/authContext.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const SkillExchangeForm = () => {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { recipientId } = location.state || {};

  const [offeredSkills, setOfferedSkills] = useState('');
  const [requestedSkills, setRequestedSkills] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!recipientId || recipientId === currentUser?._id) {
      setError("You can't send a request to yourself.");
      return;
    }

    try {
      const response = await API.post(
        '/skill-exchange/request',
        {
          recipientId,
          offeredSkills: offeredSkills.split(',').map(skill => skill.trim()),
          requestedSkills: requestedSkills.split(',').map(skill => skill.trim()),
        },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setOfferedSkills('');
      setRequestedSkills('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
<div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
  <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
         <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-xl text-red-500 hover:text-red-600"
          aria-label="Close"
        >
          ❌
        </button>

        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-4">
          Request Skill Exchange
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="offeredSkills" className="block text-sm font-medium text-gray-700">
              Offered Skills <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="offeredSkills"
              value={offeredSkills}
              onChange={(e) => setOfferedSkills(e.target.value)}
              placeholder="e.g., React, Node.js"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="requestedSkills" className="block text-sm font-medium text-gray-700">
              Requested Skills <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="requestedSkills"
              value={requestedSkills}
              onChange={(e) => setRequestedSkills(e.target.value)}
              placeholder="e.g., MongoDB, AWS"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Send Request
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillExchangeForm;
