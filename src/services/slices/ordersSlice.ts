import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

export interface OrdersState {
  feeds: TOrdersData | null;
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  feeds: null,
  userOrders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feeds
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        console.log('fetchUserOrders fulfilled:', action.payload);
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log('createOrder fulfilled:', action.payload);
        state.loading = false;
        state.currentOrder = action.payload.order;

        // Check that the order contains all necessary fields
        if (action.payload.order && action.payload.order._id) {
          console.log('createOrder: adding complete order to userOrders:', action.payload.order);
          state.userOrders.unshift(action.payload.order);
        } else {
          console.log('createOrder: order is incomplete, not adding to userOrders');
        }
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      // Fetch Order By Number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.orders[0];
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearError, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
