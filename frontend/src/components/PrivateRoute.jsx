import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const decoded = jwtDecode(token);
      if (!allowedRoles.includes(decoded.role)) {
        return <Navigate to="/" />;
      }
    } catch {
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
