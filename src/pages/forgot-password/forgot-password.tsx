import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { validateForgotPasswordForm } from '../../utils/validation';
import { forgotPassword, clearAuthError } from '../../services/slices';

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

  // Очищаем ошибки при изменении email
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsSubmitted(false);
    if (errorText) {
      dispatch(clearAuthError());
    }
  };

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Обработка успешного восстановления пароля
  useEffect(() => {
    console.log('ForgotPassword useEffect:', {
      loading,
      errorText,
      isSubmitted
    });
    if (!loading && !errorText && isSubmitted) {
      console.log('Redirecting to reset-password page');
      // Если запрос выполнен успешно, переходим на страницу сброса пароля
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  }, [loading, errorText, isSubmitted, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Валидация формы
    const validation = validateForgotPasswordForm(email);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    // Отправляем запрос на сервер
    console.log('Submitting forgot password form with email:', email);
    setIsSubmitted(true);
    dispatch(forgotPassword({ email }));
  };

  return (
    <ForgotPasswordUI
      errorText={errorText}
      email={email}
      setEmail={handleEmailChange}
      handleSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};
