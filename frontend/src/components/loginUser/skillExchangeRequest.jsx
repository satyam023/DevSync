import React, { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import { AiOutlineSwap } from 'react-icons/ai';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { MdPendingActions } from 'react-icons/md';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import Avatar from '@mui/material/Avatar';

const SkillExchangeRequests = ({ userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    accepted: false,
    sent: false,
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get('/skill-exchange/get-skills', { withCredentials: true });
      setRequests(response.data.data);
    } catch (err) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchRequests();
    let count = 0;
    const maxRefreshCount = 2;
    const intervalId = setInterval(() => {
      count++;
      if (count > maxRefreshCount) clearInterval(intervalId);
      else fetchRequests();
    }, 300000);
    return () => clearInterval(intervalId);
  }, [userId, activeTab]);

  const handleRespond = async (exchangeId, status) => {
    try {
      const response = await API.patch(
        `/skill-exchange/${exchangeId}/respond`,
        { status },
        { withCredentials: true }
      );
      const { request, updatedRequester, updatedRecipient } = response.data.data;
      setSuccess(`Request ${status}`);
      setRequests(prev =>
        prev.map(r =>
          r._id === exchangeId
            ? {
                ...request,
                requester: updatedRequester || request.requester,
                recipient: updatedRecipient || request.recipient,
              }
            : r
        )
      );
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to respond to request.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleSection = section => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Correct filtering
  const pending = requests.filter(
    r =>
      r.status === 'pending' &&
      r.recipient._id === userId // only show pending requests *to* the user
  );

  const accepted = requests.filter(
    r =>
      r.status === 'accepted' &&
      (r.recipient._id === userId || r.requester._id === userId)
  );

  const sentByMe = requests.filter(
    r =>
      r.requester._id === userId
  );

  const renderRequestCard = (req, isPending = false) => (
    <div
      key={req._id}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white shadow-sm"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          alt={req.requester.name}
          src={req.requester.image || ''}
          sx={{ width: 40, height: 40 }}
        />
        <div className="flex-1">
          <p className="font-medium text-gray-800">{req.requester.name}</p>
          <p className={`text-sm mt-1 ${
            req.status === 'rejected' ? 'text-red-500' :
            isPending ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {req.status === 'pending'
              ? `Waiting for response from ${req.recipient?.name}`
              : req.status === 'accepted'
              ? `Exchange accepted by ${req.recipient?.name}`
              : req.status === 'rejected'
              ? `Rejected by ${req.recipient?.name}`
              : ''}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-1">OFFERED SKILLS:</p>
        <div className="flex flex-wrap gap-2">
          {req.offeredSkills.map(skill => (
            <span key={skill} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-1">REQUESTED SKILLS:</p>
        <div className="flex flex-wrap gap-2">
          {req.requestedSkills.map(skill => (
            <span key={skill} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {isPending && req.recipient._id === userId && (
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={() => handleRespond(req._id, 'rejected')}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Reject
          </button>
          <button
            onClick={() => handleRespond(req._id, 'accepted')}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );

  const renderSection = (label, Icon, count, sectionKey, items, isPending = false) => (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer mb-3 p-2 bg-gray-50 rounded-lg"
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center">
          <Icon className={`mr-2 ${
            sectionKey === 'pending' ? 'text-yellow-600' :
            sectionKey === 'accepted' ? 'text-green-600' :
            'text-blue-600'
          }`} />
          <h2 className="text-sm font-medium text-gray-700">
            {label.toUpperCase()} ({count})
          </h2>
        </div>
        {expandedSections[sectionKey] ? (
          <IoChevronUp className="text-gray-500" />
        ) : (
          <IoChevronDown className="text-gray-500" />
        )}
      </div>
      {expandedSections[sectionKey] && (
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg">
              No {label.toLowerCase()} found.
            </div>
          ) : (
            items.map(req => renderRequestCard(req, isPending))
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-100 mt-4">
        <div className="text-center py-6 text-gray-500">Loading skill exchange requests...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-100 mt-4">
      <h1 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <AiOutlineSwap className="text-2xl text-blue-600" />
        Skill Exchange Requests
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-4">
        {[`Pending (${pending.length})`, `Accepted (${accepted.length})`, `Sent (${sentByMe.length})`].map((tab, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 whitespace-nowrap border-b-2 text-sm font-medium transition-all ${
              activeTab === idx
                ? 'border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600 border-transparent'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Body */}
      <div className="space-y-4">
        {activeTab === 0 && renderSection('Pending Requests', MdPendingActions, pending.length, 'pending', pending, true)}
        {activeTab === 1 && renderSection('Accepted Exchanges', RiCheckboxCircleLine, accepted.length, 'accepted', accepted)}
        {activeTab === 2 && renderSection('Sent Requests', AiOutlineSwap, sentByMe.length, 'sent', sentByMe)}
      </div>
    </div>
  );
};

export default SkillExchangeRequests;
