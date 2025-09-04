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
  clearBurgerConstructor,
  upIngredient,
  downIngredient,
  removeIngredient
} from '../../services/slices/burger-constructor/slice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor.burgerConstructor
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

  // Рассчитываем общую стоимость
  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
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
    dispatch(clearBurgerConstructor());
  };

  const handleMoveIngredient = (dragIndex: number, hoverIndex: number) => {
    if (hoverIndex < dragIndex) {
      dispatch(upIngredient(dragIndex));
    } else {
      dispatch(downIngredient(dragIndex));
    }
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    const ingredient = ingredients.find((ing) => ing.id === ingredientId);
    if (ingredient) {
      dispatch(removeIngredient(ingredient));
    }
  };

  // Определяем, должна ли кнопка быть заблокирована
  const isOrderButtonDisabled =
    !bun || ingredients.length === 0 || orderRequest;

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
      isOrderButtonDisabled={isOrderButtonDisabled}
    />
  );
};
