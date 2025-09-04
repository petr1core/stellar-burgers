import React, { FC, memo } from 'react';
import { useSelector } from '../../../services/store';
import { useParams } from 'react-router-dom';
import styles from './ingredient-details.module.css';
import { IngredientDetailsUIProps } from './type';

export const IngredientDetailsUI: FC<IngredientDetailsUIProps> = memo(
  ({ ingredientData }) => {
    const { name, image_large, calories, proteins, fat, carbohydrates } =
      ingredientData;

    return (
      <div className={styles.content} data-testid='ingredient-details-modal'>
        <img
          className={styles.img}
          alt='изображение ингредиента.'
          src={image_large}
        />
        <h3 className='text text_type_main-medium mt-2 mb-4'>{name}</h3>
        <ul className={`${styles.nutritional_values} text_type_main-default`}>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Калории, ккал</p>
            <p className={`text text_type_digits-default`}>{calories}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Белки, г</p>
            <p className={`text text_type_digits-default`}>{proteins}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Жиры, г</p>
            <p className={`text text_type_digits-default`}>{fat}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Углеводы, г</p>
            <p className={`text text_type_digits-default`}>{carbohydrates}</p>
          </li>
        </ul>
      </div>
    );
  }
);

export const IngredientDetails: FC = () => {
  const { ingredients } = useSelector((state: any) => state.ingredients);
  const { id } = useParams<{ id: string }>();

  // Находим ингредиент по ID из параметров роута
  const ingredientData = ingredients.find(
    (ingredient: any) => ingredient._id === id
  ) || {
    _id: '',
    name: 'Булочка',
    type: 'bun',
    proteins: 9,
    fat: 3,
    carbohydrates: 53,
    calories: 251,
    price: 60,
    image: '',
    image_mobile: '',
    image_large: '',
    __v: 0
  };

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
