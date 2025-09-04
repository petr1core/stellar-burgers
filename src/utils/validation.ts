// Утилиты для валидации форм

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

// Валидация email
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, errorMessage: 'Обязательное поле' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, errorMessage: 'Некорректный формат email' };
  }

  return { isValid: true, errorMessage: '' };
};

// Валидация пароля
export const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) {
    return { isValid: false, errorMessage: 'Обязательное поле' };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      errorMessage: 'Минимальная длина пароля 6 символов'
    };
  }

  return { isValid: true, errorMessage: '' };
};

// Валидация имени
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, errorMessage: 'Обязательное поле' };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      errorMessage: 'Минимальная длина имени 2 символа'
    };
  }

  return { isValid: true, errorMessage: '' };
};

// Валидация кода восстановления
export const validateResetCode = (code: string): ValidationResult => {
  if (!code.trim()) {
    return { isValid: false, errorMessage: 'Обязательное поле' };
  }

  if (code.length !== 6) {
    return { isValid: false, errorMessage: 'Код должен содержать 6 символов' };
  }

  return { isValid: true, errorMessage: '' };
};

// Валидация формы входа
export const validateLoginForm = (email: string, password: string) => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  return {
    isValid: emailValidation.isValid && passwordValidation.isValid,
    errors: {
      email: emailValidation.errorMessage,
      password: passwordValidation.errorMessage
    }
  };
};

// Валидация формы регистрации
export const validateRegisterForm = (
  name: string,
  email: string,
  password: string
) => {
  const nameValidation = validateName(name);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  return {
    isValid:
      nameValidation.isValid &&
      emailValidation.isValid &&
      passwordValidation.isValid,
    errors: {
      name: nameValidation.errorMessage,
      email: emailValidation.errorMessage,
      password: passwordValidation.errorMessage
    }
  };
};

// Валидация формы восстановления пароля
export const validateForgotPasswordForm = (email: string) => {
  const emailValidation = validateEmail(email);

  return {
    isValid: emailValidation.isValid,
    errors: {
      email: emailValidation.errorMessage
    }
  };
};

// Валидация формы сброса пароля
export const validateResetPasswordForm = (password: string, token: string) => {
  const passwordValidation = validatePassword(password);
  const tokenValidation = validateResetCode(token);

  return {
    isValid: passwordValidation.isValid && tokenValidation.isValid,
    errors: {
      password: passwordValidation.errorMessage,
      token: tokenValidation.errorMessage
    }
  };
};
