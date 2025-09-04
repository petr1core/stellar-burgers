import { FC } from 'react';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { feeds, userOrders } = useSelector((state: RootState) => state.orders);

  // Объединяем все заказы для статистики
  const allOrders: TOrder[] = [...(feeds?.orders || []), ...(userOrders || [])];

  const readyOrders = getOrders(allOrders, 'done');
  const pendingOrders = getOrders(allOrders, 'pending');

  // Используем данные из feeds для статистики
  const feed = {
    total: feeds?.total || 0,
    totalToday: feeds?.totalToday || 0
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
