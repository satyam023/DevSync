import React, { useEffect, useState } from 'react';
import API from '../../utils/axios.jsx';
import UsersList from '../../components/loggedOutUser/userList.jsx';
import ErrorBoundary from '../../components/dialog/errorBoundry.jsx';
import { useAuth } from '../../context/authContext.jsx';

const DevelopersPage = () => {
  const { user: currentUser } = useAuth();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  let isMounted = true;

  const fetchDevelopers = async () => {
    try {
      const res = await API.get('/users/getuser');
      const allUsers = res.data;
      if (isMounted) {
        const filteredDevelopers = allUsers.filter(
          user => user.role === 'developer' && user._id !== currentUser._id
        );
        setDevelopers(filteredDevelopers);
      }
    } catch (err) {
      console.error('Error fetching developers:', err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchDevelopers();

  const intervalId = setInterval(fetchDevelopers, 30000); // fetch every 30 seconds

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}, [currentUser]);


  if (loading) return <p className="text-center mt-10">Loading Developers...</p>;
  if (developers.length === 0) return <p className="text-center mt-10">No developer found.</p>;

  return (
    <ErrorBoundary>
      <UsersList title="Developers" users={developers} />
    </ErrorBoundary>
  );
};

export default DevelopersPage;
