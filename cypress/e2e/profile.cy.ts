/// <reference types="cypress" />

describe('Профиль пользователя', () => {
    beforeEach(() => {
        // Устанавливаем токены авторизации правильно
        cy.setCookie('accessToken', 'Bearer test-access-token');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
        });

        // Перехватываем запросы к API
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
            statusCode: 200,
            body: {
                success: true,
                user: {
                    email: 'test@example.com',
                    name: 'Test User'
                }
            }
        }).as('getUser');

        cy.intercept('PATCH', 'https://norma.nomoreparties.space/api/auth/user', {
            statusCode: 200,
            body: {
                success: true,
                user: {
                    email: 'updated@example.com',
                    name: 'Updated Name'
                }
            }
        }).as('updateUser');

        cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders', { fixture: 'orders.json' }).as('getUserOrders');
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders/*', { fixture: 'order.json' }).as('getOrderByNumber');

        cy.visit('/profile');
        cy.wait('@getUser');
    });

    it('должен отображать заголовок "Профиль"', () => {
        cy.contains('Профиль').should('be.visible');
    });

    it('должен отображать форму профиля с данными пользователя', () => {
        cy.get('form').should('be.visible');
        cy.get('input[name="name"]').should('have.value', 'Test User');
        cy.get('input[type="email"]').should('have.value', 'test@example.com');
    });

    it('должен позволять редактировать имя пользователя', () => {
        cy.contains('Сохранить').should('not.exist');
        cy.contains('Отменить').should('not.exist');
        cy.get('input[name="name"]').clear();
        cy.get('input[name="name"]').type('Новое Имя');
        cy.contains('Сохранить').should('be.visible').and('not.be.disabled');
        cy.contains('Отменить').should('be.visible');
    });

    it('должен позволять редактировать email пользователя', () => {
        // Проверяем, что кнопки изначально не видны
        cy.contains('Сохранить').should('not.exist');
        cy.contains('Отменить').should('not.exist');

        // Очищаем поле email
        cy.get('input[type="email"]').clear();

        // Вводим новый email
        cy.get('input[type="email"]').type('newemail@example.com');

        // Проверяем, что появились кнопки
        cy.contains('Сохранить').should('be.visible').and('not.be.disabled');
        cy.contains('Отменить').should('be.visible');
    });

    it('должен позволять изменить пароль', () => {
        // Проверяем, что кнопки изначально не видны
        cy.contains('Сохранить').should('not.exist');
        cy.contains('Отменить').should('not.exist');

        // Вводим новый пароль
        cy.get('input[type="password"]').type('newpassword123');

        // Проверяем, что появились кнопки
        cy.contains('Сохранить').should('be.visible').and('not.be.disabled');
        cy.contains('Отменить').should('be.visible');
    });

    it('должен сохранять изменения в профиле', () => {
        cy.get('input[name="name"]').clear().type('Обновленное Имя');
        cy.get('input[type="email"]').clear().type('updated@example.com');
        cy.contains('Сохранить').click();
        cy.wait('@updateUser');
        cy.contains('Сохранить').should('not.exist');
        cy.contains('Отменить').should('not.exist');
        cy.get('input[name="name"]').should('have.value', 'Updated Name');
        cy.get('input[type="email"]').should('have.value', 'updated@example.com');
    });

    it('должен восстанавливать исходные данные при нажатии кнопки "Отменить"', () => {
        // Изменяем имя
        cy.get('input[name="name"]').clear().type('Временное Имя');

        // Проверяем, что кнопка "Отменить" появилась
        cy.contains('Отменить').should('be.visible');

        // Кликаем кнопку "Отменить"
        cy.contains('Отменить').click();

        // Проверяем, что имя восстановилось к исходному значению
        cy.get('input[name="name"]').should('have.value', 'Test User');

        // Проверяем, что кнопки исчезли
        cy.contains('Сохранить').should('not.exist');
        cy.contains('Отменить').should('not.exist');
    });

    it('должен отображать кнопку "Выход"', () => {
        cy.get('[data-testid="logout-button"]').should('be.visible').and('contain', 'Выход');
    });

    it('должен выходить из системы при нажатии кнопки "Выход"', () => {
        // Перехватываем запрос выхода
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/logout', {
            statusCode: 200,
            body: { success: true }
        }).as('logout');

        // Кликаем кнопку "Выход"
        cy.get('[data-testid="logout-button"]').click();

        // Ждем ответа от API
        cy.wait('@logout');

        // Проверяем, что произошел редирект на главную страницу
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('должен отображать ссылку на историю заказов', () => {
        cy.contains('История заказов').should('be.visible');
    });

    it('должен переходить на страницу истории заказов', () => {
        // Кликаем по ссылке истории заказов
        cy.contains('История заказов').click();

        // Проверяем, что перешли на страницу истории заказов
        cy.url().should('eq', Cypress.config().baseUrl + '/profile/orders');
        cy.contains('История заказов').should('be.visible');
    });

    it('должен не отображать кнопки "Сохранить" и "Отменить" при отсутствии изменений', () => {
        // Проверяем, что кнопки не отображаются при отсутствии изменений
        cy.contains('Сохранить').should('not.exist');
        cy.contains('Отменить').should('not.exist');
    });

    afterEach(() => {
        // Очищаем данные авторизации после каждого теста
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});
