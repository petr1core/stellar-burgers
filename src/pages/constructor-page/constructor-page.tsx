import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect, useMemo } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const { loading: isIngredientsLoading } = useSelector(
    (state: RootState) => state.ingredients
  );
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor.burgerConstructor
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
      ingredients.forEach((ingredient: any) => {
        counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
      });
    }

    return counters;
  }, [bun, ingredients]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients ingredientCounters={ingredientCounters} />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
