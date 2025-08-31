import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  TLoginData,
  TRegisterData,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../../utils/burger-api';
import { deleteCookie, setCookie } from '../../../utils/cookie';

/**
 * Асинхронно авторизуемся
 * @param data Логин и пароль для авторизации
 */
export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const result = await loginUserApi(data);
      setCookie('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      return result.user;
    } catch (error: any) {
      // Ошибка от API имеет структуру { success: false, message: "текст ошибки" }
      const errorMessage = error?.message || 'Ошибка авторизации';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Асинхронно снимаем авторизацию
 */
export const logoutUserThunk = createAsyncThunk('users/logoutUser', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

/**
 * Асинхронно подгружаем данные пользователя
 */
export const getUserThunk = createAsyncThunk('users/getUser', async () =>
  getUserApi()
);

/**
 * Асинхронно регистрируем пользователя на сервере
 * @param data Имя, логин и пароль пользователя
 */
export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      // Токены устанавливаются только при успешной регистрации
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

/**
 * Асинхронно обновляем данные пользователя
 * @param data Обновлённые имя, логин и пароль пользователя
 */
export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

/**
 * Асинхронно подгружаем историю заказов пользователя
 */
export const getOrdersThunk = createAsyncThunk(
  'users/getUserOrders',
  async () => getOrdersApi()
);
