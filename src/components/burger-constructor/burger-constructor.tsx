import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/ordersSlice';
import {
  clearConstructor,
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bun, ingredients, totalPrice } = useSelector(
    (state: RootState) => state.constructor
  );
  const { currentOrder, loading: orderRequest } = useSelector(
    (state: RootState) => state.orders
  );

  // Создаем счетчики для ингредиентов
  const ingredientCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    // Считаем булочку
    if (bun) {
      counters[bun._id] = 2; // Булочка всегда считается дважды
    }

    // Считаем остальные ингредиенты
    if (ingredients && Array.isArray(ingredients)) {
      ingredients.forEach((ingredient: TConstructorIngredient) => {
        counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
      });
    }

    return counters;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    // Проверяем авторизацию
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Создаем массив ID ингредиентов для заказа
    const ingredientIds: string[] = [];
    if (bun) {
      ingredientIds.push(bun._id, bun._id); // Булочка добавляется дважды
    }
    if (ingredients && ingredients.length > 0) {
      ingredients.forEach((ingredient) => {
        ingredientIds.push(ingredient._id);
      });
    }

    // Отправляем заказ
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
    dispatch(clearConstructor());
  };

  const handleMoveIngredient = (dragIndex: number, hoverIndex: number) => {
    dispatch(moveIngredient({ dragIndex, hoverIndex }));
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    dispatch(removeIngredient(ingredientId));
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onMoveIngredient={handleMoveIngredient}
      onRemoveIngredient={handleRemoveIngredient}
    />
  );
};
