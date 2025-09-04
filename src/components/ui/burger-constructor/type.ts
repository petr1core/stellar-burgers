import { TOrder, TConstructorIngredient } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
  onRemoveIngredient: (ingredientId: string) => void;
  isOrderButtonDisabled: boolean;
};
