import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> => {
  console.log(
    'checkResponse: status:',
    res.status,
    'ok:',
    res.ok,
    'url:',
    res.url
  );
  if (res.ok) {
    return res.json();
  } else {
    return res.json().then((err) => {
      console.log('checkResponse: error response:', err);
      return Promise.reject(err);
    });
  }
};

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> => {
  console.log('refreshToken: refreshing token...');
  return fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      console.log('refreshToken: response:', refreshData);
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      console.log(
        'refreshToken: tokens updated, new accessToken:',
        refreshData.accessToken
      );
      return refreshData;
    });
};

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    console.log('fetchWithRefresh: making request to:', url);
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    console.log('fetchWithRefresh: error:', err);
    if ((err as { message: string }).message === 'jwt expired') {
      console.log('fetchWithRefresh: token expired, refreshing...');
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      console.log('fetchWithRefresh: retrying request with new token');
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

export const getIngredientsApi = () => {
  console.log('getIngredientsApi: calling');
  return fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      console.log('getIngredientsApi: response:', data);
      if (data?.success) return data.data;
      return Promise.reject(data);
    });
};

export const getFeedsApi = () => {
  console.log('getFeedsApi: calling');
  return fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      console.log('getFeedsApi: response:', data);
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

export const getOrdersApi = () => {
  console.log('getOrdersApi: calling with token:', getCookie('accessToken'));
  return fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    console.log('getOrdersApi: response:', data);
    if (data?.success) {
      // API returns all orders, need to filter by user
      // For now returning all orders for debugging
      console.log('getOrdersApi: returning orders:', data.orders);
      return data.orders;
    }
    return Promise.reject(data);
  });
};

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) => {
  console.log('orderBurgerApi: calling with ingredients:', data);
  return fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    console.log('orderBurgerApi: response:', data);
    if (data?.success) return data;
    return Promise.reject(data);
  });
};

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) => {
  console.log('getOrderByNumberApi: calling with number:', number);
  return fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) => {
  console.log('registerUserApi: calling with data:', data);
  return fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      console.log('registerUserApi: response:', data);
      if (data?.success) {
        console.log('registerUserApi: setting tokens');
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data;
      }
      return Promise.reject(data);
    });
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) => {
  console.log('loginUserApi: calling with data:', data);
  return fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      console.log('loginUserApi: response:', data);
      if (data?.success) {
        console.log('loginUserApi: setting tokens');
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data;
      }
      return Promise.reject(data);
    });
};

export const forgotPasswordApi = (data: { email: string }) => {
  console.log('forgotPasswordApi: calling with email:', data.email);
  return fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      console.log('forgotPasswordApi: response:', data);
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

export const resetPasswordApi = (data: { password: string; token: string }) => {
  console.log('resetPasswordApi: calling with token:', data.token);
  return fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      console.log('resetPasswordApi: response:', data);
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () => {
  console.log('getUserApi: calling with token:', getCookie('accessToken'));
  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });
};

export const updateUserApi = (user: Partial<TRegisterData>) => {
  console.log('updateUserApi: calling with user:', user);
  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });
};

export const logoutApi = () => {
  console.log(
    'logoutApi: calling with refresh token:',
    localStorage.getItem('refreshToken')
  );
  return fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
};
