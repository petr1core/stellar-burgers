import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../../services/slices/user/slice';
import '@testing-library/jest-dom';

// Мокаем useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { from: { pathname: '/test' } } })
}));

// Мокаем весь модуль login
jest.mock('./login', () => ({
  Login: () => <div data-testid='login-component'>Login Component</div>
}));

const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: {
      user: userSlice
    },
    preloadedState: {
      user: {
        isAuthenticated: false,
        loginUserRequest: false,
        user: null,
        orders: [],
        ordersRequest: false,
        error: null,
        ...initialState
      }
    }
  });

describe('User Slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен обрабатывать ошибку авторизации', () => {
    const store = createTestStore();

    // Симулируем ошибку авторизации
    store.dispatch({
      type: 'users/loginUser/rejected',
      payload: undefined,
      meta: { requestId: 'test', requestStatus: 'rejected' },
      error: { message: 'Неверный логин или пароль' }
    });

    const state = store.getState().user;
    expect(state.error).toBe('Неверный логин или пароль');
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.loginUserRequest).toBe(false);
  });

  it('должен обрабатывать успешную авторизацию', () => {
    const store = createTestStore();

    // Симулируем успешную авторизацию
    store.dispatch({
      type: 'users/loginUser/fulfilled',
      payload: { name: 'Test User', email: 'test@test.com' },
      meta: { requestId: 'test', requestStatus: 'fulfilled' }
    });

    const state = store.getState().user;
    expect(state.error).toBe(null);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ name: 'Test User', email: 'test@test.com' });
    expect(state.loginUserRequest).toBe(false);
  });

  it('должен обрабатывать состояние загрузки', () => {
    const store = createTestStore();

    // Симулируем начало загрузки
    store.dispatch({
      type: 'users/loginUser/pending',
      meta: { requestId: 'test', requestStatus: 'pending' }
    });

    const state = store.getState().user;
    expect(state.loginUserRequest).toBe(true);
    expect(state.error).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен очищать ошибки', () => {
    const store = createTestStore({
      error: 'Some error message'
    });

    // Очищаем ошибки
    store.dispatch({ type: 'user/clearErrors' });

    const state = store.getState().user;
    expect(state.error).toBe(null);
  });
});
