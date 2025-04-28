import React from 'react';
import { Outlet } from 'react-router-dom';
import RoleBasedNavbar from './RoleBasedNavbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  console.log('Layout component rendering');

  return (
    <>
      <RoleBasedNavbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
