/// <reference types="cypress" />

// Селекторы для элементов интерфейса
export const SELECTORS = {
    // Навигация
    CONSTRUCTOR_LINK: 'Конструктор',
    FEED_LINK: 'Лента заказов',
    PROFILE_LINK: 'Личный кабинет',
    ORDERS_HISTORY_LINK: 'История заказов',

    // Формы авторизации
    LOGIN_TITLE: 'Вход',
    REGISTER_TITLE: 'Регистрация',
    FORGOT_PASSWORD_TITLE: 'Восстановление пароля',
    RESET_PASSWORD_TITLE: 'Восстановление пароля',

    // Поля ввода
    EMAIL_INPUT: '[data-testid="email-input"]',
    PASSWORD_INPUT: '[data-testid="password-input"]',
    NAME_INPUT: '[data-testid="name-input"]',
    EMAIL_INPUT_TYPE: 'input[type="email"]',
    PASSWORD_INPUT_TYPE: 'input[type="password"]',
    NAME_INPUT_NAME: 'input[name="name"]',

    // Кнопки
    LOGIN_BUTTON: '[data-testid="login-button"]',
    REGISTER_BUTTON: '[data-testid="register-button"]',
    LOGOUT_BUTTON: '[data-testid="logout-button"]',
    ORDER_BUTTON: '[data-testid="order-button"]',
    REFRESH_BUTTON: '[data-testid="refresh-button"]',
    MODAL_CLOSE_BUTTON: '[data-testid="modal-close-button"]',
    RESTORE_BUTTON: '[data-testid="restore-button"]',
    SAVE_BUTTON: '[data-testid="save-button"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',

    // Ссылки
    REGISTER_LINK: 'Зарегистрироваться',
    LOGIN_LINK: 'Войти',
    FORGOT_PASSWORD_LINK: 'Восстановить пароль',
    REMEMBER_PASSWORD_LINK: 'Вспомнили пароль?',

    // Ингредиенты
    INGREDIENT_BUN: '[data-testid="ingredient-bun"]',
    INGREDIENT_MAIN: '[data-testid="ingredient-main"]',
    INGREDIENT_SAUCE: '[data-testid="ingredient-sauce"]',
    ADD_BUTTON_BUN: '[data-testid="add-button-bun"]',
    ADD_BUTTON_MAIN: '[data-testid="add-button-main"]',
    ADD_BUTTON_SAUCE: '[data-testid="add-button-sauce"]',

    // Конструктор
    CONSTRUCTOR_BUN_TOP: '[data-testid="constructor-bun-top"]',
    CONSTRUCTOR_BUN_BOTTOM: '[data-testid="constructor-bun-bottom"]',
    CONSTRUCTOR_INGREDIENTS_AREA: '[data-testid="constructor-ingredients-area"]',
    TOTAL_PRICE: '[data-testid="total-price"]',

    // Модальные окна
    INGREDIENT_DETAILS_MODAL: '[data-testid="ingredient-details-modal"]',
    ORDER_DETAILS_MODAL: '[data-testid="order-details-modal"]',
    MODAL_OVERLAY: '[data-testid="modal-overlay"]',
    MODAL: '[data-testid="modal"]',

    // Лента заказов
    ORDERS_LIST: '[data-testid="orders-list"]',
    ORDER_CARD: '[data-testid="order-card"]',
    TOTAL_ORDERS: '[data-testid="total-orders"]',
    TOTAL_TODAY: '[data-testid="total-today"]',
    READY_ORDERS: '[data-testid="ready-orders"]',
    PENDING_ORDERS: '[data-testid="pending-orders"]',
    PENDING_ORDERS_ITEM_12346: '[data-testid="pending-orders-item-12346"]',
    READY_ORDERS_ITEM_12345: '[data-testid="ready-orders-item-12345"]',

    // Заголовки страниц
    CONSTRUCTOR_TITLE: 'Соберите бургер',
    FEED_TITLE: 'Лента заказов',
    PROFILE_TITLE: 'Профиль',
    ORDERS_HISTORY_TITLE: 'История заказов',

    // Категории ингредиентов
    BUNS_CATEGORY: 'Булки',
    MAINS_CATEGORY: 'Начинки',
    SAUCES_CATEGORY: 'Соусы',

    // Кнопки действий (текст)
    SAVE_BUTTON_TEXT: 'Сохранить',
    CANCEL_BUTTON_TEXT: 'Отменить',
    RESTORE_BUTTON_TEXT: 'Восстановить',
    ENTER_BUTTON_TEXT: 'Войти',
    REGISTER_ACTION_BUTTON_TEXT: 'Зарегистрироваться',

    // Часто используемые тексты
    CONSTRUCTOR_PAGE_TITLE: 'Соберите бургер',
    LOGIN_PAGE_TITLE: 'Вход',
    REGISTER_PAGE_TITLE: 'Регистрация',
    PROFILE_PAGE_TITLE: 'Профиль',
    FEED_PAGE_TITLE: 'Лента заказов',
    ORDERS_HISTORY_PAGE_TITLE: 'История заказов',
    FORGOT_PASSWORD_PAGE_TITLE: 'Восстановление пароля',

    // Навигационные элементы
    CONSTRUCTOR_NAV_LINK: 'Конструктор',
    FEED_NAV_LINK: 'Лента заказов',
    LOGIN_NAV_LINK: 'Войти',
    REGISTER_NAV_LINK: 'Зарегистрироваться',
    FORGOT_PASSWORD_NAV_LINK: 'Восстановить пароль',
    ORDERS_HISTORY_NAV_LINK: 'История заказов',

    // Категории ингредиентов (текст)
    BUNS_CATEGORY_TEXT: 'Булки',
    MAINS_CATEGORY_TEXT: 'Начинки',
    SAUCES_CATEGORY_TEXT: 'Соусы',

    // Кнопки действий
    SAVE_ACTION_BUTTON: 'Сохранить',
    CANCEL_ACTION_BUTTON: 'Отменить',
    RESTORE_ACTION_BUTTON: 'Восстановить',
    LOGIN_ACTION_BUTTON: 'Войти',
    REGISTER_ACTION_BUTTON: 'Зарегистрироваться',

    // Статистика
    COMPLETED_ALL_TIME: 'Выполнено за все время:',
    COMPLETED_TODAY: 'Выполнено за сегодня:',
    READY_STATUS: 'Готовы:',
    IN_PROGRESS_STATUS: 'В работе:',
    REFRESH_TEXT: 'Обновить',

    // Сообщения об ошибках
    REQUIRED_FIELD_ERROR: 'Обязательное поле',
    EMAIL_FORMAT_ERROR: 'Некорректный формат email',
    PASSWORD_MIN_LENGTH_ERROR: 'Некорректный пароль',
    NAME_MIN_LENGTH_ERROR: 'Минимальная длина имени 2 символа',

    // Состав заказа
    ORDER_COMPOSITION: 'Состав:',
    ORDER_INFO: 'Информация о заказе',
    ORDER_COMPLETED: 'Выполнен'
} as const;

// API endpoints
export const API_ENDPOINTS = {
    INGREDIENTS: 'api/ingredients',
    ORDERS: 'api/orders',
    ORDERS_ALL: 'api/orders/all',
    ORDER_BY_NUMBER: 'api/orders/*',
    AUTH_LOGIN: 'api/auth/login',
    AUTH_REGISTER: 'api/auth/register',
    AUTH_LOGOUT: 'api/auth/logout',
    AUTH_USER: 'api/auth/user',
    AUTH_TOKEN: 'api/auth/token',
    PASSWORD_RESET: 'api/password-reset',
    PASSWORD_RESET_RESET: 'api/password-reset/reset'
} as const;

// URL paths
export const URLS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    PROFILE: '/profile',
    PROFILE_ORDERS: '/profile/orders',
    FEED: '/feed'
} as const;
