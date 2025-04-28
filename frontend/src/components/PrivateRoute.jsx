import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  console.log('PrivateRoute: Checking token', localStorage.getItem('token'));
  const isAuthenticated = localStorage.getItem('token');

  // If authenticated, render the Outlet which will be the child route component
  // If not authenticated, redirect to the landing page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
