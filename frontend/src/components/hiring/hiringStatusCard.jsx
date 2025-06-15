import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { Business, Work } from '@mui/icons-material';
import API from '../../utils/axios.jsx';
import PaymentButton from '../../components/payment/paymentButton.jsx';

const HiringStatusCard = ({ user }) => {
  // All existing state and functionality remains exactly the same
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedTabs, setExpandedTabs] = useState({ 0: true, 1: false, 2: false });

  const role = user.role?.toLowerCase();
  const isRecruiter = role === 'recruiter';
  const isDeveloper = role === 'developer';

  // Keep all existing useEffect and functions exactly as they were
  useEffect(() => {
    const fetchHiringData = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        if (isRecruiter) endpoint = '/hiring/sent';
        else if (isDeveloper) endpoint = '/hiring/received';
        else return;

        const res = await API.get(endpoint);
        setHirings(res.data.hirings || []);
      } catch (error) {
        console.error('Error fetching hiring data:', error);
        setHirings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHiringData();
  }, [isRecruiter, isDeveloper, tabIndex]);

  const updateStatus = async (id, newStatus) => {
    // Keep original implementation
    setActionLoading(id);
    try {
      let endpoint = '';
      let data = {};
      if (newStatus === 'accepted') endpoint = `/hiring/accept/${id}`;
      else if (newStatus === 'rejected') endpoint = `/hiring/reject/${id}`;
      else if (newStatus === 'completed') endpoint = `/hiring/complete/${id}`;
      else {
        endpoint = `/hiring/status/${id}`;
        data = { status: newStatus };
      }
      await API.patch(endpoint, data);
      setHirings((prev) => {
        if (newStatus === 'rejected') {
          return prev.filter((h) => h._id !== id);
        }
        return prev.map((h) => (h._id === id ? { ...h, status: newStatus } : h));
      });
    } catch (error) {
      console.error(`Failed to update status to ${newStatus}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const filterByStatus = (status) => hirings.filter((h) => h.status === status);

  // Only UI changes below this point
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const tabs = isRecruiter
    ? [
        { label: `Sent (${hirings.length})`, status: 'sent' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
      ]
    : [
        { label: `Pending (${filterByStatus('pending').length})`, status: 'pending' },
        { label: `Accepted (${filterByStatus('accepted').length})`, status: 'accepted' },
        { label: `Completed (${filterByStatus('completed').length})`, status: 'completed' },
      ];

  const toggleTabExpansion = (index) => {
    setExpandedTabs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderHiringCard = (hire, status) => {
    const otherParty = isRecruiter ? hire.candidate : hire.recruiter;
    const currentStatus = isRecruiter && status === 'sent' ? hire.status : status;

    return (
      <div key={hire._id} className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex items-center gap-4 flex-1">
            <Avatar
              src={otherParty?.image}
              sx={{ width: 48, height: 48 }}
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {otherParty?.name || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{hire.message}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[currentStatus] || statusColors.default}`}>
              {currentStatus?.toUpperCase() || 'UNKNOWN'}
            </span>
            {currentStatus === 'accepted' && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                hire.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {hire.paid ? 'PAID' : 'PENDING PAYMENT'}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <p className="font-medium text-gray-500">Role</p>
            <p>{hire.role}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Duration</p>
            {hire.duration ? `${hire.duration} weeks` : 'Duration not specified'}
          </div>
          <div>
            <p className="font-medium text-gray-500">Rate</p>
            <p>₹{hire.rate}</p>
          </div>
          {(currentStatus === 'accepted' || currentStatus === 'completed') && (
            <div>
              <p className="font-medium text-gray-500">Contact Email</p>
              <p>{otherParty?.email || 'Not available'}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          {isDeveloper && currentStatus === 'pending' && (
            <>
              <button
                onClick={() => updateStatus(hire._id, 'rejected')}
                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={actionLoading === hire._id}
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus(hire._id, 'accepted')}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={actionLoading === hire._id}
              >
                Accept
              </button>
            </>
          )}
          {isDeveloper && currentStatus === 'accepted' && (
            <button
              onClick={() => updateStatus(hire._id, 'completed')}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={actionLoading === hire._id}
            >
              Mark as Completed
            </button>
          )}
          {isRecruiter && currentStatus === 'accepted' && (
            <PaymentButton
              data={hire}
              type="hire"
              disabled={hire.paid === true}
              buttonText={hire.paid ? 'Paid' : 'Pay Now'}
              className="px-4 py-2 text-sm font-medium"
            />
          )}
        </div>
      </div>
    );
  };

  if (!isRecruiter && !isDeveloper) return null;

  if (loading) return (
    <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="text-center py-8 text-gray-500">Loading hiring requests...</div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          {isRecruiter ? (
            <Business className="text-2xl text-blue-600" />
          ) : (
            <Work className="text-2xl text-blue-600" />
          )}
          {isRecruiter ? 'Sent Hiring Requests' : 'Hiring Requests Received'}
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
                    {(isRecruiter && tab.status === 'sent' ? hirings : filterByStatus(tab.status)).length > 0 ? (
                      (isRecruiter && tab.status === 'sent' ? hirings : filterByStatus(tab.status)).map((hire) =>
                        renderHiringCard(hire, tab.status)
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

export default HiringStatusCard;