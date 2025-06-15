import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/axios.jsx';

const SendRequestForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [alreadyPending, setAlreadyPending] = useState(false);

  const role = 'developer';

  useEffect(() => {
    const checkPendingRequest = async () => {
      try {
        const res = await API.get(`/hiring/check/${userId}`);
        if (res.data.exists) {
          setAlreadyPending(true);
          setStatus('Request already pending.');
        }
      } catch (error) {
        console.error('Check error:', error.response?.data || error.message);
      }
    };

    if (userId) checkPendingRequest();
  }, [userId]);

  const handleSend = async () => {
    try {
      const response = await API.post('/hiring/create', {
        candidateId: userId,
        role,
        duration,
        message,
      });

      setStatus(response.data.message || 'Request sent successfully!');
      setAlreadyPending(true);
    } catch (error) {
      console.error('Send error:', error.response?.data || error.message);
      setStatus(error.response?.data?.message || 'Failed to send request.');
    }
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    // Allow only digits
    if (/^\d*$/.test(value)) {
      setDuration(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 right-2 text-red-600 text-2xl font-bold hover:text-red-800 focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Send Hiring Request
        </h2>

        <div className="space-y-4">
          {/* Duration Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (in weeks)
            </label>
            <input
              type="text"
              placeholder="e.g., 4"
              value={duration}
              onChange={handleDurationChange}
              disabled={alreadyPending}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Write a short message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={alreadyPending}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleSend}
              disabled={!duration || !message || alreadyPending}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                alreadyPending || !duration || !message
                  ? 'bg-gray-300 cursor-not-allowed text-gray-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {alreadyPending ? 'Request Pending' : 'Send Request'}
            </button>
          </div>

          {/* Status Message */}
          {status && (
            <p
              className={`text-sm text-center font-medium mt-2 ${
                status.toLowerCase().includes('success') || status.includes('sent')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendRequestForm;
