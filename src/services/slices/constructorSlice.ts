import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../../utils/types';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  totalPrice: number;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  totalPrice: 0
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
      state.totalPrice = calculateTotalPrice(state.bun, state.ingredients);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
      state.totalPrice = calculateTotalPrice(state.bun, state.ingredients);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      if (
        dragIndex >= 0 &&
        hoverIndex >= 0 &&
        dragIndex < state.ingredients.length &&
        hoverIndex < state.ingredients.length &&
        dragIndex !== hoverIndex
      ) {
        const ingredients = [...state.ingredients];

        // Меняем элементы местами
        [ingredients[dragIndex], ingredients[hoverIndex]] = [
          ingredients[hoverIndex],
          ingredients[dragIndex]
        ];

        state.ingredients = ingredients;
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.totalPrice = 0;
    }
  }
});

// Функция для расчета общей стоимости
const calculateTotalPrice = (
  bun: TConstructorIngredient | null,
  ingredients: TConstructorIngredient[] | undefined
): number => {
  const bunPrice = bun ? bun.price * 2 : 0; // Булочка считается дважды
  const ingredientsPrice =
    ingredients && Array.isArray(ingredients)
      ? ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
      : 0;
  return bunPrice + ingredientsPrice;
};

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
