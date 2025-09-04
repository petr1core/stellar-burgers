import { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../services/store';
import { resetPassword } from '../../../../services/slices';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { ResetPasswordUIProps } from './type';
import { validateResetPasswordForm } from '../../../../utils/validation';

export const ResetPasswordUI: FC<ResetPasswordUIProps> = ({
  errorText,
  password,
  setPassword,
  handleSubmit,
  token,
  setToken,
  validationErrors
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Восстановление пароля</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='login'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name='password'
          />
          {validationErrors.password && (
            <p className={`${styles.error} text text_type_main-default pt-2`}>
              {validationErrors.password}
            </p>
          )}
        </div>
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Введите код из письма'
            onChange={(e) => setToken(e.target.value)}
            value={token}
            name='token'
            error={!!validationErrors.token}
            errorText={validationErrors.token || ''}
            size='default'
          />
          {validationErrors.token && (
            <p className={`${styles.error} text text_type_main-default pt-2`}>
              {validationErrors.token}
            </p>
          )}
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button type='primary' size='medium' htmlType='submit'>
            Сохранить
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
        <Link to='/login' className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);

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

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Валидация формы
    const validation = validateResetPasswordForm(password, token);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    dispatch(resetPassword({ password, token }));
  };

  return (
    <ResetPasswordUI
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      errorText={errorText}
      handleSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};
