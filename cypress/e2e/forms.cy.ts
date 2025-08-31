/// <reference types="cypress" />

describe('Формы авторизации и регистрации', () => {
    beforeEach(() => {
        // перехватываем запросы к API
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/register', { fixture: 'user.json' }).as('register');
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/password-reset', { success: true }).as('passwordReset');
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/password-reset/reset', { success: true }).as('resetPassword');
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    });

    describe('Форма входа', () => {
        beforeEach(() => {
            cy.visit('/login');
        });
        it('должен отображать заголовок "Вход"', () => {
            cy.contains('Вход').should('be.visible');
        });

        it('должен отображать поля для ввода email и пароля', () => {
            cy.get('input[type="email"]').should('be.visible');
            cy.get('input[type="password"]').should('be.visible');
        });

        it('должен отображать кнопку "Войти"', () => {
            cy.contains('Войти').should('be.visible');
        });

        it('должен отображать ссылку "Зарегистрироваться"', () => {
            cy.contains('Зарегистрироваться').should('be.visible');
        });

        it('должен отображать ссылку "Восстановить пароль"', () => {
            cy.contains('Восстановить пароль').should('be.visible');
        });

        it('должен валидировать обязательные поля', () => {
            cy.contains('Войти').click({ force: true });
            cy.contains('Обязательное поле').should('be.visible');
        });

        it('должен валидировать формат email', () => {
            cy.get('input[type="email"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="password"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get('input[type="email"]').type('invalid-email', { force: true });
            cy.get('input[type="password"]').type('password123', { force: true });
            cy.contains('Войти').click({ force: true });

            cy.url().should('include', '/login');
            cy.get('input[type="email"]').should('have.value', 'invalid-email');
        });

        it('должен валидировать минимальную длину пароля', () => {
            cy.get('input[type="email"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="password"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get('input[type="email"]').type('test@example.com', { force: true });
            cy.get('input[type="password"]').type('123', { force: true });
            cy.contains('Войти').click({ force: true });

            cy.contains('Минимальная длина пароля 6 символов').should('be.visible');
        });

        it('должен успешно авторизовать пользователя при вводе корректных данных', () => {
            cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
                statusCode: 200,
                fixture: 'user.json'
            }).as('login');

            cy.get('input[type="email"]').clear({ force: true });
            cy.get('input[type="password"]').clear({ force: true });
            cy.get('input[type="email"]').type('test@example.com', { force: true });
            cy.get('input[type="password"]').type('password123', { force: true });
            cy.contains('Войти').click({ force: true });
            cy.wait('@login');
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });

        it('не пускает при неудачной авторизации', () => {
            // устанавливаем intercept для ошибки авторизации
            cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
                statusCode: 401,
                fixture: 'login-error.json'
            }).as('loginError');

            cy.get('input[type="email"]').clear({ force: true });
            cy.get('input[type="password"]').clear({ force: true });

            cy.get('input[type="email"]').type('wrong@example.com', { force: true });
            cy.get('input[type="password"]').type('wrongpassword', { force: true });

            cy.contains('Войти').click({ force: true });

            cy.wait('@loginError');

            cy.url().should('eq', Cypress.config().baseUrl + '/login');
        });
    });

    describe('Форма регистрации', () => {
        beforeEach(() => {
            cy.visit('/register');
        });

        it('должен отображать заголовок "Регистрация"', () => {
            cy.contains('Регистрация').should('be.visible');
        });

        it('должен отображать поля для ввода имени, email и пароля', () => {
            cy.get('input[name="name"]').should('be.visible');
            cy.get('input[type="email"]').should('be.visible');
            cy.get('input[type="password"]').should('be.visible');
        });

        it('должен отображать кнопку "Зарегистрироваться"', () => {
            cy.contains('Зарегистрироваться').should('be.visible');
        });

        it('должен отображать ссылку "Войти"', () => {
            cy.contains('Войти').should('be.visible');
        });

        it('должен валидировать обязательные поля', () => {
            cy.contains('Зарегистрироваться').click({ force: true });

            cy.contains('Обязательное поле').should('be.visible');
        });

        it('должен валидировать минимальную длину имени', () => {
            cy.get('input[name="name"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="email"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="password"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get('input[name="name"]').type('А', { force: true });
            cy.get('input[type="email"]').type('test@example.com', { force: true });
            cy.get('input[type="password"]').type('password123', { force: true });

            cy.contains('Зарегистрироваться').click({ force: true });

            cy.contains('Минимальная длина имени 2 символа').should('be.visible');
        });

        it('должен валидировать формат email', () => {
            cy.get('input[name="name"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="email"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="password"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get('input[name="name"]').type('Тестовый Пользователь', { force: true });
            cy.get('input[type="email"]').type('invalid-email', { force: true });
            cy.get('input[type="password"]').type('password123', { force: true });

            cy.contains('Зарегистрироваться').click({ force: true });

            // проверяем, что форма не отправляется - остаемся на странице регистрации
            cy.url().should('include', '/register');

            // проверяем, что поля не очистились (форма не отправилась)
            cy.get('input[type="email"]').should('have.value', 'invalid-email');
        });

        it('должен валидировать минимальную длину пароля', () => {
            cy.get('input[name="name"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="email"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });
            cy.get('input[type="password"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });

            // вводим короткий пароль
            cy.get('input[name="name"]').type('Тестовый Пользователь', { force: true });
            cy.get('input[type="email"]').type('test@example.com', { force: true });
            cy.get('input[type="password"]').type('123', { force: true });

            cy.contains('Зарегистрироваться').click({ force: true });

            // проверяем, что появилась ошибка валидации пароля
            cy.contains('Минимальная длина пароля 6 символов').should('be.visible');
        });

        it('должен успешно зарегистрировать пользователя при вводе корректных данных', () => {
            cy.get('input[name="name"]').type('Новый Пользователь', { force: true });
            cy.get('input[type="email"]').type('newuser@example.com', { force: true });
            cy.get('input[type="password"]').type('newpassword123', { force: true });

            cy.contains('Зарегистрироваться').click({ force: true });

            cy.wait('@register');

            // проверяем, что произошел редирект на главную страницу
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
        it('должен валидировать данные перед отправкой', () => {
            // вводим некорректные данные (короткое имя)
            cy.get('input[name="name"]').type('А', { force: true });
            cy.get('input[type="email"]').type('test@example.com', { force: true });
            cy.get('input[type="password"]').type('password123', { force: true });

            cy.contains('Зарегистрироваться').click({ force: true });

            cy.contains('Минимальная длина имени 2 символа').should('be.visible');

            // проверяем, что форма не отправилась - остаемся на странице регистрации
            cy.url().should('include', '/register');
        });
    });

    describe('Форма восстановления пароля', () => {
        beforeEach(() => {
            cy.visit('/forgot-password');
        });
        it('должен отображать заголовок "Восстановление пароля"', () => {
            cy.contains('Восстановление пароля').should('be.visible');
        });

        it('должен отображать поле для ввода email', () => {
            cy.get('input[type="email"]').should('be.visible');
        });

        it('должен отображать кнопку "Восстановить"', () => {
            cy.contains('Восстановить').should('be.visible');
        });

        it('должен отображать ссылку "Вспомнили пароль?"', () => {
            cy.contains('Вспомнили пароль?').should('be.visible');
        });

        it('должен валидировать обязательное поле email', () => {
            // пытаемся отправить форму без данных
            cy.contains('Восстановить').click({ force: true });

            // проверяем, что появилось сообщение об ошибке
            cy.contains('Обязательное поле').should('be.visible');
        });

        it('должен валидировать формат email', () => {
            // очищаем поле перед тестом
            cy.get('input[type="email"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get('input[type="email"]').type('invalid-email', { force: true });

            cy.contains('Восстановить').click({ force: true });

            // проверяем, что форма не отправляется - остаемся на странице восстановления пароля
            cy.url().should('include', '/forgot-password');
        });

        it('должен успешно отправить запрос на восстановление пароля', () => {
            cy.get('input[type="email"]').click({ force: true }).type('{selectAll}{backspace}', { force: true });

            cy.get('input[type="email"]').type('test@example.com', { force: true });

            cy.contains('Восстановить').click({ force: true });

            // проверяем, что форма отправилась - происходит редирект на страницу сброса пароля
            cy.url().should('eq', Cypress.config().baseUrl + '/reset-password');
        });
    });

    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});
