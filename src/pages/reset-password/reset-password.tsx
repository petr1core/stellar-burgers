import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { validateResetPasswordForm } from '../../utils/validation';
import { resetPassword } from '../../services/slices';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error: errorText,
    user
  } = useSelector((state: any) => state.auth);

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Валидация формы
    const validation = validateResetPasswordForm(password, token);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    // Отправляем запрос на сервер
    dispatch(resetPassword({ password, token }));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={errorText}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};
