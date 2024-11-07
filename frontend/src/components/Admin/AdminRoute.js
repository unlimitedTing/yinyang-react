import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useSelector(state => state.user);
  if (loading === undefined) {
    console.warn("Warning: 'loading' state is undefined.");
    return <div>Loading...</div>;
  }

  if (loading) return <div>Loading...</div>;
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);
  console.log(user);
  console.log('Loading', loading);
  console.log(isAuthenticated);
  const isAdmin = user.role == 'admin';
  // Check if user is authenticated and is an admin
  if (!isAuthenticated || !isAdmin) {
    // Redirect to login or not-authorized page if not an admin
    return <Navigate to='/login' replace />;
  }

  // If user is authenticated and is an admin, render the children components
  return children;
};

export default AdminRoute;
