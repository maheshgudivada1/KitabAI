import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const ProtectedRoute = () => {
  const { user, loading } = useUser(); // Destructure loading state

  // Check if the user is authorized
  const isAuthorized = user && user.role === 'admin'; // Adjust the condition based on your authorization logic

  if (loading) {
    return <div>Loading...</div>; // Render a loading state
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;