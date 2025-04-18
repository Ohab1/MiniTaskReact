import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from './utils';

function ProtectedRoute({ children }) {
  const tokenIsValid = useMemo(() => isTokenValid(), []);

  return tokenIsValid ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
