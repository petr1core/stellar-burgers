import { forwardRef } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, ingredientCounters }, ref) => (
  <IngredientsCategoryUI
    title={title}
    titleRef={titleRef}
    ingredients={ingredients}
    ingredientsCounters={ingredientCounters}
    ref={ref}
  />
));
