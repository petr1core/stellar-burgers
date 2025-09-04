import { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../../services/store';
import { registerUser } from '../../../../services/slices';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterUIProps } from './type';
import { validateRegisterForm } from '../../../../utils/validation';

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit,
  password,
  setPassword,
  validationErrors,
  userName,
  setUserName
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='register'
        onSubmit={handleSubmit}
      >
        <>
          <div className='pb-6'>
            <Input
              type='text'
              placeholder='Имя'
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              name='name'
              error={!!validationErrors.name}
              errorText={validationErrors.name || ''}
              size='default'
              data-testid='name-input'
            />
            {validationErrors.name && (
              <p className={`${styles.error} text text_type_main-default pt-2`}>
                {validationErrors.name}
              </p>
            )}
          </div>
          <div className='pb-6'>
            <Input
              type='email'
              placeholder='E-mail'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name={'email'}
              error={!!validationErrors.email}
              errorText={validationErrors.email || ''}
              size={'default'}
              data-testid='email-input'
            />
            {validationErrors.email && (
              <p className={`${styles.error} text text_type_main-default pt-2`}>
                {validationErrors.email}
              </p>
            )}
          </div>
          <div className='pb-6'>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name='password'
              data-testid='password-input'
            />
            {validationErrors.password && (
              <p className={`${styles.error} text text_type_main-default pt-2`}>
                {validationErrors.password}
              </p>
            )}
          </div>
          <div className={`pb-6 ${styles.button}`}>
            <Button
              type='primary'
              size='medium'
              htmlType='submit'
              data-testid='register-button'
            >
              Зарегистрироваться
            </Button>
          </div>
          {errorText && (
            <p className={`${styles.error} text text_type_main-default pb-6`}>
              {errorText}
            </p>
          )}
        </>
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Уже зарегистрированы?
        <Link to='/login' className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error: errorText,
    user
  } = useSelector((state: any) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
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
    const validation = validateRegisterForm(userName, email, password);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    dispatch(registerUser({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
      errorText={errorText}
      handleSubmit={handleSubmit}
      validationErrors={validationErrors}
    />
  );
};
