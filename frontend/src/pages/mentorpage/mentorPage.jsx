import React, { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import UsersList from '../../components/loggedOutUser/userList.jsx';
import ErrorBoundary from '../../components/dialog/errorBoundry.jsx';
import { useAuth } from '../../context/authContext.jsx';

const MentorPage = () => {
  const {user : currentUser} = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;

  const fetchMentors = async () => {
    try {
      const res = await API.get('/users/getuser');
      const allUsers = res.data;
      if (isMounted) {
        const filteredMentors = allUsers.filter(
          user => user.role === 'mentor' && user._id !== currentUser._id
        );
        setMentors(filteredMentors);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchMentors();

  const intervalId = setInterval(fetchMentors, 30000); 

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}, [currentUser]);

  if (loading) return <p className="text-center mt-10">Loading mentors...</p>;
  if (mentors.length === 0) return <p className="text-center mt-10">No mentors found.</p>;

  return (
    <ErrorBoundary>
      <UsersList title="Mentors" users={mentors} />
    </ErrorBoundary>
  );
};

export default MentorPage;
