import React, { FC, memo } from 'react';
import { useSelector } from '../../../services/store';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => (
  <div className={styles.wrap}>
    <h3 className={`text text_type_main-medium  pb-3 pt-10 ${styles.header}`}>
      {orderInfo.name}
    </h3>
    <OrderStatus status={orderInfo.status} />
    <p className={`text text_type_main-medium pt-15 pb=6`}>Состав:</p>
    <ul className={`${styles.list} mb-8`}>
      {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
        <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
          <div className={styles.img_wrap}>
            <div className={styles.border}>
              <img
                className={styles.img}
                src={item.image_mobile}
                alt={item.name}
              />
            </div>
          </div>
          <span className='text text_type_main-default pl-4'>{item.name}</span>
          <span
            className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
          >
            {item.count} x {item.price}
          </span>
          <CurrencyIcon type={'primary'} />
        </li>
      ))}
    </ul>
    <div className={styles.bottom}>
      <p className='text text_type_main-default text_color_inactive'>
        <FormattedDate date={orderInfo.date} />
      </p>
      <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
        {orderInfo.total}
      </span>
      <CurrencyIcon type={'primary'} />
    </div>
  </div>
));

export const OrderInfo: FC = () => {
  const { currentOrder } = useSelector((state: any) => state.orders);

  // TODO: преобразовать данные заказа в нужный формат
  const orderInfo = currentOrder
    ? {
        ingredientsInfo: {},
        date: new Date(currentOrder.createdAt),
        total: 0,
        _id: currentOrder._id,
        status: currentOrder.status,
        name: currentOrder.name,
        createdAt: currentOrder.createdAt,
        updatedAt: currentOrder.updatedAt,
        number: currentOrder.number,
        ingredients: currentOrder.ingredients
      }
    : {
        ingredientsInfo: {},
        date: new Date(),
        total: 0,
        _id: '',
        status: 'pending',
        name: 'Заказ #1234',
        createdAt: '',
        updatedAt: '',
        number: 1234,
        ingredients: []
      };

  return <OrderInfoUI orderInfo={orderInfo} />;
};
