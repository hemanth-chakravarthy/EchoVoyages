import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  console.log('Layout component rendering');

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
