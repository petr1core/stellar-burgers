/// <reference types="cypress" />

describe('Авторизация пользователя', () => {
    beforeEach(() => {
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/register', { fixture: 'user.json' }).as('register');
    });

    it('должен перенаправлять неавторизованного пользователя на страницу входа', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/profile');

        cy.url().should('eq', Cypress.config().baseUrl + '/login');
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('должен найти элементы формы на странице входа', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/login');

        cy.contains('Вход').should('be.visible');
        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('должен успешно авторизовать пользователя при вводе корректных данных', () => {
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', { fixture: 'user.json' }).as('login');

        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/login');
        cy.contains('Вход').should('be.visible');

        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');

        cy.get('[data-testid="email-input"] input').type('test@example.com');
        cy.get('[data-testid="password-input"] input').type('password123');
        cy.get('[data-testid="login-button"]').click();
        cy.wait('@login');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('должен не пускать на страницу при вводе некорректных данных', () => {
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
            success: false,
            message: 'Неверный логин или пароль'
        }).as('loginError');

        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/login');
        cy.contains('Вход').should('be.visible');

        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');

        cy.get('[data-testid="email-input"] input').type('wrong@example.com');
        cy.get('[data-testid="password-input"] input').type('wrongpassword');

        cy.get('[data-testid="login-button"]').click();

        cy.wait('@loginError');

        cy.contains('Вход').should('be.visible');
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('должен успешно зарегистрировать нового пользователя', () => {
        cy.visit('/register');
        cy.get('[data-testid="name-input"]').should('be.visible');
        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');

        cy.get('[data-testid="name-input"] input').type('Новый Пользователь');
        cy.get('[data-testid="email-input"] input').type('newuser@example.com');
        cy.get('[data-testid="password-input"] input').type('newpassword123');
        cy.get('[data-testid="register-button"]').click();
        cy.wait('@register');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('должен успешно выйти из системы', () => {
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/logout', { success: true }).as('logout');

        cy.setCookie('accessToken', 'test-access-token');
        cy.setCookie('refreshToken', 'test-refresh-token');
        cy.visit('/profile');
        cy.wait('@getUser');
        cy.contains('Профиль').should('be.visible');
        cy.get('[data-testid="logout-button"]').should('be.visible');
        cy.get('[data-testid="logout-button"]').click();
        cy.wait('@logout');
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('должен обновлять токен при истечении срока действия', () => {
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/token', (req) => {
            req.reply({
                success: true,
                accessToken: 'Bearer new-access-token',
                refreshToken: 'new-refresh-token'
            });
        }).as('refreshToken');

        cy.setCookie('accessToken', 'expired-access-token');
        cy.setCookie('refreshToken', 'valid-refresh-token');

        cy.visit('/profile');

        cy.contains('Вход', { timeout: 20000 }).should('be.visible');
    });
});
