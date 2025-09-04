/// <reference types="cypress" />
/// <reference path="../support/commands.ts" />

import { SELECTORS, URLS } from "../support/selectors";

describe('Формы авторизации и регистрации', () => {
    beforeEach(() => {
        // перехватываем запросы к API
        cy.intercept('POST', 'api/auth/register', { fixture: 'user.json' }).as('register');
        cy.intercept('POST', 'api/password-reset', { success: true }).as('passwordReset');
        cy.intercept('POST', 'api/password-reset/reset', { success: true }).as('resetPassword');
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    });

    describe('Форма входа', () => {
        beforeEach(() => {
            cy.visitPage(URLS.LOGIN);
        });

        it('должен отображать заголовок "Вход"', () => {
            cy.contains(SELECTORS.LOGIN_PAGE_TITLE).should('be.visible');
        });

        it('должен отображать поля для ввода email и пароля', () => {
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).should('be.visible');
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).should('be.visible');
        });

        it('должен отображать кнопку "Войти"', () => {
            cy.contains(SELECTORS.LOGIN_ACTION_BUTTON).should('be.visible');
        });

        it('должен отображать ссылку "Зарегистрироваться"', () => {
            cy.contains(SELECTORS.REGISTER_NAV_LINK).should('be.visible');
        });

        it('должен отображать ссылку "Восстановить пароль"', () => {
            cy.contains(SELECTORS.FORGOT_PASSWORD_NAV_LINK).should('be.visible');
        });

        it('должен валидировать обязательные поля', () => {
            cy.get(SELECTORS.LOGIN_BUTTON)
                .should('be.visible')
                .click({ force: true });
            cy.contains(SELECTORS.REQUIRED_FIELD_ERROR)
                .should('be.visible');
        });

        it('должен валидировать формат email', () => {
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('invalid-email', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('password123', { force: true });
            cy.contains(SELECTORS.LOGIN_ACTION_BUTTON).click({ force: true });

            cy.url().should('include', '/login');
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).should('have.value', 'invalid-email');
        });

        it('должен валидировать минимальную длину пароля', () => {
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('test@example.com', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('123', { force: true });
            cy.contains(SELECTORS.LOGIN_ACTION_BUTTON).click({ force: true });

            cy.contains(SELECTORS.PASSWORD_MIN_LENGTH_ERROR).should('be.visible');
        });

        it('должен успешно авторизовать пользователя при вводе корректных данных', () => {
            cy.intercept('POST', 'api/auth/login', {
                statusCode: 200,
                fixture: 'user.json'
            }).as('login');

            cy.get(SELECTORS.EMAIL_INPUT_TYPE).clear({ force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).clear({ force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('test@example.com', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('password123', { force: true });
            cy.get(SELECTORS.LOGIN_BUTTON).click({ force: true });
            cy.wait('@login');
            cy.url().should('eq', Cypress.config().baseUrl + URLS.HOME);
        });

        it('не пускает при неудачной авторизации', () => {
            // устанавливаем intercept для ошибки авторизации
            cy.intercept('POST', 'api/auth/login', {
                statusCode: 401,
                fixture: 'login-error.json'
            }).as('loginError');

            cy.get(SELECTORS.EMAIL_INPUT_TYPE).clear({ force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).clear({ force: true });

            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('wrong@example.com', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('wrongpassword', { force: true });

            cy.get(SELECTORS.LOGIN_BUTTON).click({ force: true });


            cy.wait('@loginError');

            cy.url().should('eq', Cypress.config().baseUrl + '/login');
        });
    });

    describe('Форма регистрации', () => {
        beforeEach(() => {
            cy.visitPage(URLS.REGISTER);
        });

        it('должен отображать заголовок "Регистрация"', () => {
            cy.contains(SELECTORS.REGISTER_PAGE_TITLE).should('be.visible');
        });

        it('должен отображать поля для ввода имени, email и пароля', () => {
            cy.get(SELECTORS.NAME_INPUT_NAME).should('be.visible');
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).should('be.visible');
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).should('be.visible');
        });

        it('должен отображать кнопку "Зарегистрироваться"', () => {
            cy.contains(SELECTORS.REGISTER_ACTION_BUTTON).should('be.visible');
        });

        it('должен отображать ссылку "Войти"', () => {
            cy.contains(SELECTORS.LOGIN_NAV_LINK).should('be.visible');
        });

        it('должен валидировать обязательные поля', () => {
            cy.contains(SELECTORS.REGISTER_ACTION_BUTTON)
                .should('be.visible')
                .click({ force: true });

            cy.contains(SELECTORS.REQUIRED_FIELD_ERROR)
                .should('be.visible');
        });

        it('должен валидировать минимальную длину имени', () => {
            cy.get(SELECTORS.NAME_INPUT_NAME).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get(SELECTORS.NAME_INPUT_NAME).type('А', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('test@example.com', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('password123', { force: true });

            cy.contains(SELECTORS.REGISTER_ACTION_BUTTON).click({ force: true });

            cy.contains(SELECTORS.NAME_MIN_LENGTH_ERROR).should('be.visible');
        });

        it('должен валидировать формат email', () => {
            cy.get(SELECTORS.NAME_INPUT_NAME).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get(SELECTORS.NAME_INPUT_NAME).type('Тестовый Пользователь', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('invalid-email', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('password123', { force: true });

            cy.contains(SELECTORS.REGISTER_ACTION_BUTTON).click({ force: true });

            cy.url().should('include', URLS.REGISTER);

            cy.get(SELECTORS.EMAIL_INPUT_TYPE).should('have.value', 'invalid-email');
        });

        it('должен валидировать минимальную длину пароля', () => {
            cy.get(SELECTORS.NAME_INPUT_NAME).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get(SELECTORS.NAME_INPUT_NAME).type('Тестовый Пользователь', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('test@example.com', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('123', { force: true });

            cy.contains(SELECTORS.REGISTER_ACTION_BUTTON).click({ force: true });

            cy.contains(SELECTORS.PASSWORD_MIN_LENGTH_ERROR).should('be.visible');
        });

        it('должен успешно зарегистрировать пользователя при вводе корректных данных', () => {
            cy.get(SELECTORS.NAME_INPUT_NAME).type('Новый Пользователь', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('newuser@example.com', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('newpassword123', { force: true });

            cy.contains(SELECTORS.REGISTER_ACTION_BUTTON).click({ force: true });

            cy.wait('@register');

            cy.url().should('eq', Cypress.config().baseUrl + URLS.HOME);
        });

        it('должен валидировать данные перед отправкой', () => {
            cy.get(SELECTORS.NAME_INPUT_NAME).type('А', { force: true });
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('test@example.com', { force: true });
            cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('password123', { force: true });

            cy.contains(SELECTORS.REGISTER_ACTION_BUTTON).click({ force: true });

            cy.contains(SELECTORS.NAME_MIN_LENGTH_ERROR).should('be.visible');

            cy.url().should('include', URLS.REGISTER);
        });
    });

    describe('Форма восстановления пароля', () => {
        beforeEach(() => {
            cy.visitPage(URLS.FORGOT_PASSWORD);
        });
        it('должен отображать заголовок "Восстановление пароля"', () => {
            cy.contains(SELECTORS.FORGOT_PASSWORD_PAGE_TITLE).should('be.visible');
        });

        it('должен отображать поле для ввода email', () => {
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).should('be.visible');
        });

        it('должен отображать кнопку "Восстановить"', () => {
            cy.contains(SELECTORS.RESTORE_ACTION_BUTTON).should('be.visible');
        });

        it('должен отображать ссылку "Вспомнили пароль?"', () => {
            cy.contains('Вспомнили пароль?').should('be.visible');
        });

        it('должен валидировать обязательное поле email', () => {
            cy.contains(SELECTORS.RESTORE_ACTION_BUTTON)
                .should('be.visible')
                .click({ force: true });

            cy.contains(SELECTORS.REQUIRED_FIELD_ERROR)
                .should('be.visible');
        });

        it('должен валидировать формат email', () => {
            cy.get(SELECTORS.EMAIL_INPUT_TYPE).click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('invalid-email', { force: true });

            cy.contains(SELECTORS.RESTORE_ACTION_BUTTON).click({ force: true });

            cy.url().should('include', URLS.FORGOT_PASSWORD);
        });

        it('должен успешно отправить запрос на восстановление пароля', () => {
            cy.wait(1000);
            cy.get(SELECTORS.EMAIL_INPUT).type('test@example.com', { force: true });

            cy.get(SELECTORS.RESTORE_BUTTON).click({ force: true });

            cy.url().should('eq', Cypress.config().baseUrl + URLS.RESET_PASSWORD);
        });
    });

    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});
