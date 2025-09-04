/// <reference types="cypress" />
import { SELECTORS, API_ENDPOINTS, URLS } from '../support/selectors';

describe('Авторизация пользователя', () => {
    beforeEach(() => {
        cy.clearAuth();
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
        cy.setupAuthIntercepts();
    });

    it('должен перенаправлять неавторизованного пользователя на страницу входа', () => {
        cy.visitPage(URLS.PROFILE);
        cy.url().should('eq', Cypress.config().baseUrl + URLS.LOGIN);
    });

    it('должен найти элементы формы на странице входа', () => {
        cy.visitPage(URLS.LOGIN);

        cy.contains(SELECTORS.LOGIN_TITLE).should('be.visible');
        cy.get(SELECTORS.EMAIL_INPUT).should('be.visible');
        cy.get(SELECTORS.PASSWORD_INPUT).should('be.visible');
        cy.get(SELECTORS.LOGIN_BUTTON).should('be.visible');
    });

    it('должен успешно авторизовать пользователя при вводе корректных данных', () => {
        cy.visitPage(URLS.LOGIN);
        cy.contains(SELECTORS.LOGIN_TITLE).should('be.visible');

        cy.fillLoginForm('test@example.com', 'password123');
        cy.wait('@login');

        cy.url().should('eq', Cypress.config().baseUrl + URLS.HOME);
    });

    it('должен не пускать на страницу при вводе некорректных данных', () => {
        cy.intercept('POST', API_ENDPOINTS.AUTH_LOGIN, {
            success: false,
            message: 'Неверный логин или пароль'
        }).as('loginError');

        cy.visitPage(URLS.LOGIN);
        cy.contains(SELECTORS.LOGIN_TITLE).should('be.visible');

        cy.fillLoginForm('wrong@example.com', 'wrongpassword');
        cy.wait('@loginError');

        cy.contains(SELECTORS.LOGIN_TITLE).should('be.visible');
    });

    it('должен успешно зарегистрировать нового пользователя', () => {
        cy.visitPage(URLS.REGISTER);
        cy.get(SELECTORS.NAME_INPUT).should('be.visible');
        cy.get(SELECTORS.EMAIL_INPUT).should('be.visible');
        cy.get(SELECTORS.PASSWORD_INPUT).should('be.visible');

        cy.fillRegisterForm('Новый Пользователь', 'newuser@example.com', 'newpassword123');
        cy.wait('@register');

        cy.url().should('eq', Cypress.config().baseUrl + URLS.HOME);
    });

    it('должен успешно выйти из системы', () => {
        cy.setAuthTokens('test-access-token', 'test-refresh-token');
        cy.visitPage(URLS.PROFILE);
        cy.wait('@getUser');
        cy.contains(SELECTORS.PROFILE_TITLE).should('be.visible');
        cy.get(SELECTORS.LOGOUT_BUTTON).should('be.visible').click();
        cy.wait('@logout');
        cy.url().should('eq', Cypress.config().baseUrl + URLS.HOME);
    });

    it('должен обновлять токен при истечении срока действия', () => {
        cy.intercept('POST', API_ENDPOINTS.AUTH_TOKEN, (req) => {
            req.reply({
                success: true,
                accessToken: 'Bearer new-access-token',
                refreshToken: 'new-refresh-token'
            });
        }).as('refreshToken');

        cy.setAuthTokens('expired-access-token', 'valid-refresh-token');
        cy.visitPage(URLS.PROFILE);

        // После обновления токена пользователь должен остаться на странице профиля
        cy.contains(SELECTORS.PROFILE_TITLE, { timeout: 20000 }).should('be.visible');
    });

    it('должен разлогинивать пользователя при недействительном refresh token', () => {
        cy.intercept('POST', API_ENDPOINTS.AUTH_TOKEN, (req) => {
            req.reply({
                success: false,
                message: 'Token is invalid'
            });
        }).as('refreshTokenError');

        cy.intercept('GET', API_ENDPOINTS.AUTH_USER, (req) => {
            req.reply({
                success: false,
                message: 'jwt expired'
            });
        }).as('getUserError');

        cy.setAuthTokens('expired-access-token', 'invalid-refresh-token');
        cy.visitPage(URLS.PROFILE);

        cy.wait('@getUserError');

        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + URLS.LOGIN);
        cy.contains(SELECTORS.LOGIN_TITLE).should('be.visible');
    });
});
