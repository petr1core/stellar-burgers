import { FC, memo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../services/store';
import { fetchFeeds } from '../../../../services/slices';

import styles from './feed.module.css';

import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

export const FeedUI: FC<FeedUIProps> = memo(({ orders, handleGetFeeds }) => (
  <main className={styles.containerMain}>
    <div className={`${styles.titleBox} mt-10 mb-5`}>
      <h1 className={`${styles.title} text text_type_main-large`}>
        Лента заказов
      </h1>
      <RefreshButton
        text='Обновить'
        onClick={handleGetFeeds}
        extraClass={'ml-30'}
      />
    </div>
    <div className={styles.main}>
      <div className={styles.columnOrders}>
        <OrdersList orders={orders} />
      </div>
      <div className={styles.columnInfo}>
        <FeedInfo />
      </div>
    </div>
  </main>
));

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feeds, loading } = useSelector((state: any) => state.orders);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  useEffect(() => {
    if (!feeds) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, feeds]);

  return (
    <FeedUI orders={feeds?.orders || []} handleGetFeeds={handleGetFeeds} />
  );
};
