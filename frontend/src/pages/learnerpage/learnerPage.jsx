import React, { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import UsersList from '../../components/loggedOutUser/userList.jsx';
import ErrorBoundary from '../../components/dialog/errorBoundry.jsx';
import { useAuth } from '../../context/authContext.jsx';

const LearnerPage = () => {
  const {user : currentUser} = useAuth();
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  let isMounted = true;

  const fetchLearners = async () => {
    try {
      const res = await API.get('/users/getuser');
      const allUsers = res.data;
      if (isMounted) {
        const filteredLearners = allUsers.filter(
          user => user.role === 'learner' && user._id !== currentUser._id
        );
        setLearners(filteredLearners);
      }
    } catch (err) {
      console.error('Error fetching learners:', err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchLearners();

  const intervalId = setInterval(fetchLearners, 30000); // fetch every 30 seconds

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}, [currentUser]);


  if (loading) return <p className="text-center mt-10">Loading learners...</p>;
  if (learners.length === 0) return <p className="text-center mt-10">No learners found.</p>;

  return (
    <ErrorBoundary>
      <UsersList title="Learners" users={learners} />
    </ErrorBoundary>
  );
};

export default LearnerPage;
