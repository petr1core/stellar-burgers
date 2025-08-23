import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};
