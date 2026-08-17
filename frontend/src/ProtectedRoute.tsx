import {Navigate, useLocation} from "react-router-dom";
import React, {useContext, useEffect} from "react";
import UserContext from "./store/UserContext.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  path?: string;
}

const ProtectedRoute = ({ children, requiredRole}: ProtectedRouteProps) => {
  const { isLoggedIn, isInitialized, userInfo, checkAuthStatus } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
  }, [isLoggedIn, userInfo, requiredRole]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn || !checkAuthStatus()) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }

  if (requiredRole && (!userInfo?.role || !requiredRole.includes(userInfo.role))) {
    return <Navigate to="/" replace />;  // Redirect to home instead of login for unauthorized access
  }

  return <>{children}</>;
};

export default ProtectedRoute;