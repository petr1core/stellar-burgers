import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../services/store';
import { fetchUserOrders } from '../../../../services/slices';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => {
  console.log('ProfileOrdersUI: orders prop:', orders);
  return (
    <main className={`${styles.main}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <div className={`mt-10 ${styles.orders}`}>
        <OrdersList orders={orders} />
      </div>
    </main>
  );
};

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, loading } = useSelector((state: any) => state.orders);

  useEffect(() => {
    console.log('ProfileOrders: fetching user orders');
    dispatch(fetchUserOrders());
  }, [dispatch]);

  console.log('ProfileOrders: userOrders:', userOrders, 'loading:', loading);

  return <ProfileOrdersUI orders={userOrders} />;
};
