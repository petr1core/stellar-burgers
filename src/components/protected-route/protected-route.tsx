import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { FC, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useSelector((state: any) => state.auth);
  const location = useLocation();
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
