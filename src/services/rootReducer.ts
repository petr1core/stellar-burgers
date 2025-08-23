import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/ordersSlice';
import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  auth: authReducer,
  constructor: constructorReducer
});
