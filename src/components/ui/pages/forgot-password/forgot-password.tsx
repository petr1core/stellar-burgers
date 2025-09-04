import { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../services/store';
import { forgotPassword } from '../../../../services/slices';

import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { PageUIProps, ValidationErrors } from '../common-type';
import { validateForgotPasswordForm } from '../../../../utils/validation';

export const ForgotPasswordUI: FC<
  PageUIProps & { validationErrors: ValidationErrors }
> = ({ errorText, email, setEmail, handleSubmit, validationErrors }) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Восстановление пароля</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='login'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='Укажите e-mail'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name='email'
            error={!!validationErrors.email}
            errorText={validationErrors.email || ''}
            size='default'
            data-testid='email-input'
          />
          {validationErrors.email && (
            <p className={`${styles.error} text text_type_main-default pt-2`}>
              {validationErrors.email}
            </p>
          )}
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button
            type='primary'
            size='medium'
            htmlType='submit'
            data-testid='restore-button'
          >
            Восстановить
          </Button>
        </div>
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Вспомнили пароль?
        <Link to={'/login'} className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error: errorText,
    user
  } = useSelector((state: any) => state.auth);
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Сброс состояния отправки при изменении email
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsSubmitted(false);
  };

  // Обработка успешного восстановления пароля
  useEffect(() => {
    if (!loading && !errorText && isSubmitted) {
      // Если запрос выполнен успешно, переходим на страницу сброса пароля
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  }, [loading, errorText, isSubmitted, navigate]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Валидация формы
    const validation = validateForgotPasswordForm(email);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setIsSubmitted(true);
    dispatch(forgotPassword({ email }));
  };

  return (
    <ForgotPasswordUI
      email={email}
      setEmail={handleEmailChange}
      errorText={errorText}
      handleSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};
