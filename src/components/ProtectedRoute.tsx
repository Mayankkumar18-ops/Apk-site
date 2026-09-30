import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentRole, currentUser } = useApp();

  if (!currentUser || !allowedRoles.includes(currentRole)) {
    // Redirect to login page corresponding to the required role
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    if (allowedRoles.includes('developer')) {
      return <Navigate to="/dev/login" replace />;
    }
    return <Navigate to="/user/login" replace />;
  }

  return <>{children}</>;
};
