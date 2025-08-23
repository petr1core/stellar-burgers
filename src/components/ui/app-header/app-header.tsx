import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from '../../../services/store';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  isAuthenticated
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <Link to='/' className={styles.menu_item}>
          <BurgerIcon type={'primary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </Link>
        <Link to='/feed' className={styles.menu_item}>
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </Link>
      </div>
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>
      <div className={styles.link_position_last}>
        {isAuthenticated ? (
          <Link to='/profile' className={styles.menu_item}>
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        ) : (
          <Link to='/login' className={styles.menu_item}>
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Войти</p>
          </Link>
        )}
      </div>
    </nav>
  </header>
);

export const AppHeader: FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  return <AppHeaderUI userName={user?.name} isAuthenticated={!!user} />;
};
