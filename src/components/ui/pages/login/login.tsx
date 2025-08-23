import { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../services/store';
import { loginUser } from '../../../../services/slices';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginUIProps } from './type';

export const LoginUI: FC<LoginUIProps> = ({
  email,
  setEmail,
  errorText,
  handleSubmit,
  password,
  setPassword
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Вход</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='login'
        onSubmit={handleSubmit}
      >
        <>
          <div className='pb-6'>
            <Input
              type='email'
              placeholder='E-mail'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name='email'
              error={false}
              errorText=''
              size='default'
            />
          </div>
          <div className='pb-6'>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name='password'
            />
          </div>
          <div className={`pb-6 ${styles.button}`}>
            <Button type='primary' size='medium' htmlType='submit'>
              Войти
            </Button>
          </div>
          {errorText && (
            <p className={`${styles.error} text text_type_main-default pb-6`}>
              {errorText}
            </p>
          )}
        </>
      </form>
      <div className={`pb-6 ${styles.question} text text_type_main-default`}>
        Вы - новый пользователь?
        <Link to='/register' className={`pl-2 ${styles.link}`}>
          Зарегистрироваться
        </Link>
      </div>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Забыли пароль?
        <Link to={'/forgot-password'} className={`pl-2 ${styles.link}`}>
          Восстановить пароль
        </Link>
      </div>
    </div>
  </main>
);

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

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errorText={errorText}
      handleSubmit={handleSubmit}
    />
  );
};
