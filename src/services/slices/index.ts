export { default as ingredientsReducer } from './ingredientsSlice';
export { default as ordersReducer } from './ordersSlice';
export { default as authReducer } from './authSlice';
export { default as constructorReducer } from './constructorSlice';

// Actions
export {
  fetchIngredients,
  clearError as clearIngredientsError
} from './ingredientsSlice';

export {
  fetchFeeds,
  fetchUserOrders,
  createOrder,
  fetchOrderByNumber,
  clearError as clearOrdersError,
  clearCurrentOrder
} from './ordersSlice';

export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
  logout,
  clearError as clearAuthError,
  checkAuth
} from './authSlice';

export {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
