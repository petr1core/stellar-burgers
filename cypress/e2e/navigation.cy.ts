/// <reference types="cypress" />

import { SELECTORS, URLS } from "../support/selectors";

describe('Навигация по приложению', () => {
    beforeEach(() => {
        // Перехватываем запросы к API
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', 'api/orders/all', { fixture: 'orders.json' }).as('getFeed');
        cy.intercept('GET', 'api/orders', { fixture: 'orders.json' }).as('getOrders');
        cy.intercept('POST', 'api/password-reset', { success: true }).as('passwordReset');
        cy.intercept('GET', 'api/orders/*', { fixture: 'order.json' }).as('getOrderByNumber');
    });

    it('должен переходить на страницу конструктора при клике по ссылке "Конструктор"', () => {
        cy.visitPage(URLS.FEED);
        cy.contains(SELECTORS.CONSTRUCTOR_NAV_LINK).click();
        cy.url().should('eq', Cypress.config().baseUrl + URLS.HOME);
        cy.contains(SELECTORS.CONSTRUCTOR_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу ленты заказов при клике по ссылке "Лента заказов"', () => {
        cy.visitPage(URLS.HOME);
        cy.contains(SELECTORS.FEED_NAV_LINK).click();
        cy.url().should('eq', Cypress.config().baseUrl + URLS.FEED);
        cy.contains(SELECTORS.FEED_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу профиля при клике по ссылке профилю (Test User)', () => {
        cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.setCookie('accessToken', 'Bearer test-access-token');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
        });
        cy.visitPage(URLS.HOME);
        cy.contains('Test User').click();
        cy.url().should('eq', Cypress.config().baseUrl + URLS.PROFILE);
        cy.contains(SELECTORS.PROFILE_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу истории заказов при клике по ссылке "История заказов"', () => {
        // Устанавливаем фейковые токены авторизации
        cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');


        cy.setCookie('accessToken', 'Bearer test-access-token');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
        });

        cy.visitPage(URLS.PROFILE);

        // Кликаем по ссылке "История заказов"
        cy.contains(SELECTORS.ORDERS_HISTORY_NAV_LINK).click();

        // Проверяем, что перешли на страницу истории заказов
        cy.url().should('eq', Cypress.config().baseUrl + URLS.PROFILE_ORDERS);
        cy.contains(SELECTORS.ORDERS_HISTORY_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу входа при клике по личному кабинету (вход)', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visitPage(URLS.HOME);

        // Кликаем по Личному кабинету
        cy.contains(SELECTORS.LOGIN_NAV_LINK).click();

        // Проверяем, что перешли на страницу входа
        cy.url().should('eq', Cypress.config().baseUrl + URLS.LOGIN);
        cy.contains(SELECTORS.LOGIN_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу регистрации при клике по ссылке "Зарегистрироваться"', () => {
        cy.visitPage(URLS.LOGIN);

        // Кликаем по ссылке "Зарегистрироваться"
        cy.contains(SELECTORS.REGISTER_NAV_LINK).click();

        // Проверяем, что перешли на страницу регистрации
        cy.url().should('eq', Cypress.config().baseUrl + URLS.REGISTER);
        cy.contains(SELECTORS.REGISTER_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу восстановления пароля при клике по ссылке "Восстановить пароль"', () => {
        cy.visitPage(URLS.LOGIN);

        // Кликаем по ссылке "Восстановить пароль"
        cy.contains(SELECTORS.FORGOT_PASSWORD_NAV_LINK).click();

        // Проверяем, что перешли на страницу восстановления пароля
        cy.url().should('eq', Cypress.config().baseUrl + URLS.FORGOT_PASSWORD);
        cy.contains(SELECTORS.FORGOT_PASSWORD_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу сброса пароля при клике по ссылке "Восстановить"', () => {
        cy.visitPage(URLS.FORGOT_PASSWORD);

        // Вводим email
        cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('test@example.com');

        // Кликаем кнопку "Восстановить"
        cy.contains('button', SELECTORS.RESTORE_ACTION_BUTTON).click();

        // Ждем ответа от API
        cy.wait('@passwordReset');

        // Проверяем, что перешли на страницу сброса пароля
        cy.url().should('eq', Cypress.config().baseUrl + URLS.RESET_PASSWORD);
        cy.contains(SELECTORS.FORGOT_PASSWORD_PAGE_TITLE).should('be.visible');
    });

    afterEach(() => {
        // Очищаем данные авторизации после каждого теста
        cy.clearCookies();
        cy.clearLocalStorage();
        // Дополнительная очистка для обеспечения чистого состояния
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
    });
});
