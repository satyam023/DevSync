import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import API from '../../utils/axios.jsx';

const SendMentorRequestForm = () => {
  const navigate = useNavigate();
  const { mentorId } = useParams();

  const [message, setMessage] = useState('');
  const [offeredRate, setOfferedRate] = useState('');
  const [alreadyPending, setAlreadyPending] = useState(false);
  const [status, setStatus] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  useEffect(() => {
    if (!mentorId) return;

    const checkPending = async () => {
      setLoadingCheck(true);
      try {
        const res = await API.get(`/mentor-requests/check/${mentorId}`);
        if (res.data.exists) {
          setAlreadyPending(true);
          setStatus({ type: 'warning', message: 'Request already pending for this mentor.' });
        } else {
          setAlreadyPending(false);
          setStatus(null);
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to check request status.' });
      } finally {
        setLoadingCheck(false);
      }
    };

    checkPending();
  }, [mentorId]);

  const handleSend = async () => {
    setLoadingSend(true);
    setStatus(null);
    try {
      const res = await API.post('/mentor-requests/send', {
        mentorId,
        message,
        offeredRate: Number(offeredRate),
      });
      setStatus({ type: 'success', message: res.data.message || 'Request sent successfully!' });
      setAlreadyPending(true);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send request.',
      });
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
  <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
      {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold text-center text-blue-700">Send Mentor Request</h2>

        {loadingCheck ? (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="space-y-4"
          >
            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a short message..."
                disabled={alreadyPending || loadingSend}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                required
              />
            </div>

            {/* Offered Rate Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate Offered (₹)</label>
              <input
                type="number"
                value={offeredRate}
                onChange={(e) => setOfferedRate(e.target.value)}
                placeholder="e.g. 1000"
                min={0}
                disabled={alreadyPending || loadingSend}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                required
              />
            </div>

            {/* Status Message */}
            {status && (
              <div
                className={`text-sm rounded-md px-3 py-2 ${
                  status.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : status.type === 'warning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {status.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !message || !offeredRate || alreadyPending || loadingSend || Number(offeredRate) <= 0
              }
              className={`w-full py-2 rounded-md text-white font-medium text-sm transition ${
                alreadyPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loadingSend ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Sending...
                </span>
              ) : alreadyPending ? (
                'Request Pending'
              ) : (
                'Send Request'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendMentorRequestForm;
