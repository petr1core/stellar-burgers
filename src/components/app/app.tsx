import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { ConstructorPage } from '@pages';
import {
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@ui';
import { NotFound404 } from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@ui';
import { checkAuth, getUser, fetchIngredients } from '../../services/slices';
import { ProtectedRoute } from '@components';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@ui';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchIngredients());
    // If there is a token, get user data
    if (document.cookie.includes('accessToken')) {
      dispatch(getUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
