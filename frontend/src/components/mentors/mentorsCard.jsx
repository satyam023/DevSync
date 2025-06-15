import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { School } from '@mui/icons-material';
import API from '../../utils/axios.jsx';
import PaymentButton from '../../components/payment/paymentButton.jsx';

const MentorshipStatusCard = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedTabs, setExpandedTabs] = useState({ 0: true, 1: false, 2: false });

  const role = user.role?.toLowerCase();
  const isMentor = role === 'mentor';
  const isLearner = role === 'learner';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = isMentor ? '/mentor-requests/received' : '/mentor-requests/sent';
        const res = await API.get(endpoint);
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isMentor]);

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    const routeMap = { accepted: 'accept', rejected: 'reject', completed: 'complete' };
    const route = routeMap[status];
    if (!route) return setActionLoading(null);
    try {
      await API.patch(`/mentor-requests/${route}/${id}`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filterByStatus = (status) =>
    requests.filter((r) => r.status === status);

  const tabs = isMentor
    ? [
        { label: `Pending (${filterByStatus('pending').length})`, status: 'pending' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
      ]
    : [
        { label: `Sent (${filterByStatus('pending').length})`, status: 'pending' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
      ];

  const toggleTabExpansion = (index) => {
    setExpandedTabs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderCard = (req, roleType, status) => (
    <div
      key={req._id}
      className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-4"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex items-center gap-4 flex-1">
          <Avatar
            src={roleType === 'mentor' ? req.learner?.image : req.mentor?.image}
            sx={{ width: 48, height: 48 }}
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {roleType === 'mentor' ? req.learner?.name : req.mentor?.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{req.message}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            status === 'accepted' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {status.toUpperCase()}
          </span>
          {status === 'accepted' && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              req.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {req.paid ? 'PAID' : 'PENDING PAYMENT'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
        <div>
          <p className="font-medium text-gray-500">Email</p>
          {req.status === 'accepted' || req.status === 'completed' ? (
            <p>{roleType === 'mentor' ? req.learner?.email : req.mentor?.email}</p>
          ) : (
            <p className="text-gray-400 italic">Visible after acceptance</p>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-500">Offered Rate</p>
          <p>₹{req.offeredRate || req?.mentor?.rates?.mentor}</p>
        </div>
        {roleType === 'learner' && (
          <div>
            <p className="font-medium text-gray-500">Default Rate</p>
            <p>₹{req?.mentor?.rates?.mentor || 'N/A'}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {roleType === 'mentor' && status === 'pending' && (
          <>
            <button
              onClick={() => updateStatus(req._id, 'rejected')}
              className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={actionLoading === req._id}
            >
              Reject
            </button>
            <button
              onClick={() => updateStatus(req._id, 'accepted')}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={actionLoading === req._id}
            >
              Accept
            </button>
          </>
        )}
        {roleType === 'mentor' && status === 'accepted' && (
          <button
            onClick={() => updateStatus(req._id, 'completed')}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={actionLoading === req._id}
          >
            Mark as Completed
          </button>
        )}
        {roleType === 'learner' && status === 'accepted' && (
          <PaymentButton
            data={{
              amount: req.offeredRate || req?.mentor?.rates?.mentor,
              toUserId: req?.mentor?._id,
              mentorRequestId: req._id,
            }}
            type="mentor"
            disabled={req.paid === true}
            buttonText={req.paid ? 'Paid' : 'Pay Now'}
            className="px-4 py-2 text-sm font-medium"
          />
        )}
      </div>
    </div>
  );

  if (!isMentor && !isLearner) return null;
  if (loading) return (
    <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="text-center py-8 text-gray-500">Loading mentorship requests...</div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <School className="text-2xl text-blue-600" />
          {isMentor ? 'Mentorship Requests Received' : 'Mentorship Requests Sent'}
        </h1>

        <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setTabIndex(idx)}
              className={`px-6 py-3 whitespace-nowrap border-b-2 text-sm font-medium transition-all ${
                tabIndex === idx
                  ? 'border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-blue-600 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {tabs.map((tab, i) => (
          <div key={i} className="mb-6">
            {tabIndex === i && (
              <>
                <div
                  className="flex items-center justify-between cursor-pointer mb-4 p-3 bg-gray-50 rounded-lg"
                  onClick={() => toggleTabExpansion(i)}
                >
                  <h2 className="text-sm font-semibold text-gray-700">
                    {tab.status.toUpperCase()} REQUESTS
                  </h2>
                  {expandedTabs[i] ? (
                    <IoChevronUp className="text-gray-500" />
                  ) : (
                    <IoChevronDown className="text-gray-500" />
                  )}
                </div>
                {expandedTabs[i] && (
                  <div className="space-y-4">
                    {filterByStatus(tab.status).length > 0 ? (
                      filterByStatus(tab.status).map((req) =>
                        renderCard(req, isMentor ? 'mentor' : 'learner', tab.status)
                      )
                    ) : (
                      <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                        No {tab.status.toLowerCase()} requests found.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorshipStatusCard;