/// <reference types="cypress" />

describe('Навигация по приложению', () => {
    beforeEach(() => {
        // Перехватываем запросы к API
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders/all', { fixture: 'orders.json' }).as('getFeed');
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders', { fixture: 'orders.json' }).as('getOrders');
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/password-reset', { success: true }).as('passwordReset');
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders/*', { fixture: 'order.json' }).as('getOrderByNumber');
    });

    it('должен переходить на страницу конструктора при клике по ссылке "Конструктор"', () => {
        cy.visit('/feed');
        cy.contains('Конструктор').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.contains('Соберите бургер').should('be.visible');
    });

    it('должен переходить на страницу ленты заказов при клике по ссылке "Лента заказов"', () => {
        cy.visit('/');
        cy.contains('Лента заказов').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/feed');
        cy.contains('Лента заказов').should('be.visible');
    });

    it('должен переходить на страницу профиля при клике по ссылке "Личный кабинет"', () => {
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.setCookie('accessToken', 'Bearer test-access-token');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
        });
        cy.visit('/');
        cy.contains('Личный кабинет').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/profile');
        cy.contains('Профиль').should('be.visible');
    });

    it('должен переходить на страницу истории заказов при клике по ссылке "История заказов"', () => {
        // Устанавливаем фейковые токены авторизации
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');


        cy.setCookie('accessToken', 'Bearer test-access-token');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
        });

        cy.visit('/profile');

        // Кликаем по ссылке "История заказов"
        cy.contains('История заказов').click();

        // Проверяем, что перешли на страницу истории заказов
        cy.url().should('eq', Cypress.config().baseUrl + '/profile/orders');
        cy.contains('История заказов').should('be.visible');
    });

    it('должен переходить на страницу входа при клике по личному кабинету', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/');

        // Кликаем по Личному кабинету
        cy.contains('Личный кабинет').click();

        // Проверяем, что перешли на страницу входа
        cy.url().should('eq', Cypress.config().baseUrl + '/login');
        cy.contains('Вход').should('be.visible');
    });

    it('должен переходить на страницу регистрации при клике по ссылке "Зарегистрироваться"', () => {
        cy.visit('/login');

        // Кликаем по ссылке "Зарегистрироваться"
        cy.contains('Зарегистрироваться').click();

        // Проверяем, что перешли на страницу регистрации
        cy.url().should('eq', Cypress.config().baseUrl + '/register');
        cy.contains('Регистрация').should('be.visible');
    });

    it('должен переходить на страницу восстановления пароля при клике по ссылке "Восстановить пароль"', () => {
        cy.visit('/login');

        // Кликаем по ссылке "Восстановить пароль"
        cy.contains('Восстановить пароль').click();

        // Проверяем, что перешли на страницу восстановления пароля
        cy.url().should('eq', Cypress.config().baseUrl + '/forgot-password');
        cy.contains('Восстановление пароля').should('be.visible');
    });

    it('должен переходить на страницу сброса пароля при клике по ссылке "Восстановить"', () => {
        cy.visit('/forgot-password');

        // Вводим email
        cy.get('input[type="email"]').type('test@example.com');

        // Кликаем кнопку "Восстановить"
        cy.contains('button', 'Восстановить').click();

        // Ждем ответа от API
        cy.wait('@passwordReset');

        // Проверяем, что перешли на страницу сброса пароля
        cy.url().should('eq', Cypress.config().baseUrl + '/reset-password');
        cy.contains('Восстановление пароля').should('be.visible');
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
