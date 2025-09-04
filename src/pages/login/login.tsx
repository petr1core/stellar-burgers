import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { validateLoginForm } from '../../utils/validation';
import { loginUser, clearAuthError } from '../../services/slices';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loading,
    error: errorText,
    user
  } = useSelector((state: any) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Очищаем ошибки при изменении полей
  const handleEmailChange: React.Dispatch<React.SetStateAction<string>> = (
    value
  ) => {
    setEmail(value);
    if (errorText) {
      dispatch(clearAuthError());
    }
  };

  const handlePasswordChange: React.Dispatch<React.SetStateAction<string>> = (
    value
  ) => {
    setPassword(value);
    if (errorText) {
      dispatch(clearAuthError());
    }
  };

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Обработка успешной авторизации
  useEffect(() => {
    if (user && !loading && !errorText) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, loading, errorText, navigate, location]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Валидация формы
    const validation = validateLoginForm(email, password);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    // Отправляем запрос на сервер
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={handleEmailChange}
      password={password}
      setPassword={handlePasswordChange}
      handleSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};
