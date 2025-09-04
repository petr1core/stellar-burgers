import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';
import ingredientsReducer, {
  IngredientsState
} from './slices/ingredientsSlice';
import ordersReducer, { OrdersState } from './slices/ordersSlice';
import authReducer, { AuthState } from './slices/authSlice';
import burgerConstructorReducer, {
  burgerConstructorState
} from './slices/burger-constructor/slice';

describe('Проверяют правильную инициализацию rootReducer', () => {
  const ingredientsInitialState: IngredientsState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const ordersInitialState: OrdersState = {
    feeds: null,
    userOrders: [],
    currentOrder: null,
    loading: false,
    error: null
  };

  const authInitialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  };

  const constructorInitialState: burgerConstructorState = {
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    error: null
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      ingredients: ingredientsInitialState,
      orders: ordersInitialState,
      auth: authInitialState,
      burgerConstructor: constructorInitialState
    }
  });

  test('smoke test constructor', () => {
    expect(store.getState().burgerConstructor).toEqual(
      burgerConstructorReducer(constructorInitialState, {
        type: 'UNKNOWN_ACTION'
      })
    );

    const addIngredientAction = { type: 'addIngredient' };
    store.dispatch(addIngredientAction);
    expect(store.getState().burgerConstructor).toEqual(constructorInitialState);

    const removeIngredientAction = { type: 'removeIngredient' };
    store.dispatch(removeIngredientAction);
    expect(store.getState().burgerConstructor).toEqual(constructorInitialState);

    const clearConstructorAction = { type: 'clearConstructor' };
    store.dispatch(clearConstructorAction);
    expect(store.getState().burgerConstructor).toEqual(constructorInitialState);
  });

  test('smoke test orders', () => {
    expect(store.getState().orders).toEqual(
      ordersReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    const fetchFeedsAction = { type: 'orders/fetchFeeds' };
    store.dispatch(fetchFeedsAction);
    expect(store.getState().orders).toEqual(ordersInitialState);

    const fetchOrderByNumberAction = { type: 'orders/fetchOrderByNumber' };
    store.dispatch(fetchOrderByNumberAction);
    expect(store.getState().orders).toEqual(ordersInitialState);
  });

  test('smoke test ingredients', () => {
    expect(store.getState().ingredients).toEqual(
      ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    const fetchIngredientsAction = { type: 'ingredients/fetchIngredients' };
    store.dispatch(fetchIngredientsAction);
    expect(store.getState().ingredients).toEqual(ingredientsInitialState);
  });

  test('smoke test auth', () => {
    expect(store.getState().auth).toEqual(
      authReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    const loginUserAction = { type: 'auth/loginUser' };
    store.dispatch(loginUserAction);
    expect(store.getState().auth).toEqual(authInitialState);

    const logoutAction = { type: 'auth/logout' };
    store.dispatch(logoutAction);
    expect(store.getState().auth).toEqual(authInitialState);
  });
});
