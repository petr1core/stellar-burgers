/// <reference types="cypress" />

import { SELECTORS, URLS } from "../support/selectors";

describe('Профиль пользователя', () => {
    beforeEach(() => {
        // Устанавливаем токены авторизации правильно
        cy.setCookie('accessToken', 'Bearer test-access-token');
        cy.window().then((win) => {
            win.localStorage.setItem('refreshToken', 'test-refresh-token');
        });

        // Перехватываем запросы к API
        cy.intercept('GET', 'api/auth/user', {
            statusCode: 200,
            body: {
                success: true,
                user: {
                    email: 'test@example.com',
                    name: 'Test User'
                }
            }
        }).as('getUser');

        cy.intercept('PATCH', 'api/auth/user', {
            statusCode: 200,
            body: {
                success: true,
                user: {
                    email: 'updated@example.com',
                    name: 'Updated Name'
                }
            }
        }).as('updateUser');

        cy.intercept('GET', 'api/orders', { fixture: 'orders.json' }).as('getUserOrders');
        cy.intercept('GET', 'api/orders/*', { fixture: 'order.json' }).as('getOrderByNumber');

        cy.visitPage(URLS.PROFILE);
        cy.wait('@getUser');
    });

    it('должен отображать заголовок "Профиль"', () => {
        cy.contains(SELECTORS.PROFILE_PAGE_TITLE).should('be.visible');
    });

    it('должен отображать форму профиля с данными пользователя', () => {
        cy.get('form').should('be.visible');
        cy.get(SELECTORS.NAME_INPUT_NAME).should('have.value', 'Test User');
        cy.get(SELECTORS.EMAIL_INPUT_TYPE).should('have.value', 'test@example.com');
    });

    it('должен позволять редактировать имя пользователя', () => {
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('not.exist');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('not.exist');
        cy.get(SELECTORS.NAME_INPUT_NAME).clear();
        cy.get(SELECTORS.NAME_INPUT_NAME).type('Новое Имя');
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('be.visible').and('not.be.disabled');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('be.visible');
    });

    it('должен позволять редактировать email пользователя', () => {
        // Проверяем, что кнопки изначально не видны
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('not.exist');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('not.exist');

        // Очищаем поле email
        cy.get(SELECTORS.EMAIL_INPUT_TYPE).clear();

        // Вводим новый email
        cy.get(SELECTORS.EMAIL_INPUT_TYPE).type('newemail@example.com');

        // Проверяем, что появились кнопки
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('be.visible').and('not.be.disabled');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('be.visible');
    });

    it('должен позволять изменить пароль', () => {
        // Проверяем, что кнопки изначально не видны
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('not.exist');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('not.exist');

        // Вводим новый пароль
        cy.get(SELECTORS.PASSWORD_INPUT_TYPE).type('newpassword123');

        // Проверяем, что появились кнопки
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('be.visible').and('not.be.disabled');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('be.visible');
    });

    it('должен сохранять изменения в профиле', () => {
        cy.get(SELECTORS.NAME_INPUT_NAME).clear().type('Обновленное Имя');
        cy.get(SELECTORS.EMAIL_INPUT_TYPE).clear().type('updated@example.com');
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).click();
        cy.wait('@updateUser');
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('not.exist');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('not.exist');
        cy.get(SELECTORS.NAME_INPUT_NAME).should('have.value', 'Updated Name');
        cy.get(SELECTORS.EMAIL_INPUT_TYPE).should('have.value', 'updated@example.com');
    });

    it('должен восстанавливать исходные данные при нажатии кнопки "Отменить"', () => {
        // Изменяем имя
        cy.get(SELECTORS.NAME_INPUT_NAME).clear().type('Временное Имя');

        // Проверяем, что кнопка "Отменить" появилась
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('be.visible');

        // Кликаем кнопку "Отменить"
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).click();

        // Проверяем, что имя восстановилось к исходному значению
        cy.get(SELECTORS.NAME_INPUT_NAME).should('have.value', 'Test User');

        // Проверяем, что кнопки исчезли
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('not.exist');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('not.exist');
    });

    it('должен отображать кнопку "Выход"', () => {
        cy.get(SELECTORS.LOGOUT_BUTTON).should('be.visible').and('contain', 'Выход');
    });

    it('должен выходить из системы при нажатии кнопки "Выход"', () => {
        // Перехватываем запрос выхода
        cy.intercept('POST', 'api/auth/logout', {
            statusCode: 200,
            body: { success: true }
        }).as('logout');

        // Кликаем кнопку "Выход"
        cy.get(SELECTORS.LOGOUT_BUTTON).click();

        // Ждем ответа от API
        cy.wait('@logout');

        // Проверяем, что произошел редирект на главную страницу
        cy.url().should('eq', Cypress.config().baseUrl + URLS.HOME);
    });

    it('должен отображать ссылку на историю заказов', () => {
        cy.contains(SELECTORS.ORDERS_HISTORY_NAV_LINK).should('be.visible');
    });

    it('должен переходить на страницу истории заказов', () => {
        // Кликаем по ссылке истории заказов
        cy.contains(SELECTORS.ORDERS_HISTORY_NAV_LINK).click();

        // Проверяем, что перешли на страницу истории заказов
        cy.url().should('eq', Cypress.config().baseUrl + URLS.PROFILE_ORDERS);
        cy.contains(SELECTORS.ORDERS_HISTORY_NAV_LINK).should('be.visible');
    });

    it('должен не отображать кнопки "Сохранить" и "Отменить" при отсутствии изменений', () => {
        // Проверяем, что кнопки не отображаются при отсутствии изменений
        cy.contains(SELECTORS.SAVE_ACTION_BUTTON).should('not.exist');
        cy.contains(SELECTORS.CANCEL_ACTION_BUTTON).should('not.exist');
    });

    afterEach(() => {
        // Очищаем данные авторизации после каждого теста
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});
