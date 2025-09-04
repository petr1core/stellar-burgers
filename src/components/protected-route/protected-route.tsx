import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { FC, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useSelector(
    (state: any) => state.auth
  );
  const location = useLocation();

  // Если идет загрузка, показываем загрузку или ничего
  if (loading) {
    return null; // или компонент загрузки
  }

  // Если не авторизован, перенаправляем на логин
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
