import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  return <AppHeaderUI userName={user?.name} isAuthenticated={!!user} />;
};
