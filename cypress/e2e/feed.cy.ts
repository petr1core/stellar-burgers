/// <reference types="cypress" />
import { SELECTORS, API_ENDPOINTS, URLS } from '../support/selectors';

describe('Лента заказов', () => {
    beforeEach(() => {
        cy.setupOrdersIntercepts();
        cy.setupIngredientsIntercepts();

        // Добавляем логирование для отладки
        cy.intercept('GET', 'api/orders/all', (req) => {
            console.log('Intercepting orders/all request');
            req.reply({ fixture: 'orders.json' });
        }).as('getFeedDebug');
    });

    it('должен загружать страницу feed и отображать заголовок', () => {
        cy.visitPage(URLS.FEED);
        cy.contains(SELECTORS.FEED_TITLE).should('be.visible');
    });

    it('должен загружать страницу feed и ее базу', () => {
        cy.visitPage(URLS.FEED);
        cy.contains(SELECTORS.FEED_TITLE).should('be.visible');
        cy.contains(SELECTORS.COMPLETED_ALL_TIME).should('be.visible');
        cy.contains(SELECTORS.COMPLETED_TODAY).should('be.visible');
        cy.contains(SELECTORS.READY_STATUS).should('be.visible');
        cy.contains(SELECTORS.IN_PROGRESS_STATUS).should('be.visible');
        cy.contains(SELECTORS.REFRESH_TEXT).should('be.visible');
    });

    it('должен отображать список заказов', () => {
        cy.visitPage(URLS.FEED);
        cy.wait('@getFeedDebug');
        cy.get(SELECTORS.ORDERS_LIST, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('a').should('have.length', 5);
            });
    });

    it('должен отображать статистику заказов', () => {
        cy.visitPage(URLS.FEED);
        cy.wait('@getFeedDebug');
        cy.wait('@getIngredients');
        cy.get(SELECTORS.ORDERS_LIST, { timeout: 10000 }).should('be.visible');

        cy.get(SELECTORS.TOTAL_ORDERS, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.TOTAL_ORDERS).invoke('text').then((text) => {
            const value = parseInt(text.replace(/\D/g, ''), 10);
            expect(value).to.be.greaterThan(0);
        });

        cy.get(SELECTORS.TOTAL_TODAY, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.TOTAL_TODAY).invoke('text').then((text) => {
            const value = parseInt(text.replace(/\D/g, ''), 10);
            expect(value).to.be.greaterThan(0);
        });
        cy.get(SELECTORS.READY_ORDERS, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.PENDING_ORDERS, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.READY_ORDERS)
            .should('be.visible')
            .within(() => {
                cy.get('li').should('have.length.at.least', 3);
            });
        cy.get(SELECTORS.PENDING_ORDERS)
            .should('be.visible')
            .within(() => {
                cy.get('li').should('have.length.at.least', 2);
            });
    });

    it('должен отображать статусы заказов с правильными цветами', () => {
        // Очищаем глобальные перехваты для этого теста
        cy.intercept('GET', 'api/orders/all', {
            success: true,
            orders: [
                {
                    _id: "test-ready-1",
                    ingredients: ["643d69a5c3f7b9001cfa093c"],
                    status: "done",
                    name: "Тестовый готовый заказ",
                    createdAt: "2024-01-01T12:00:00.000Z",
                    updatedAt: "2024-01-01T12:00:00.000Z",
                    number: 12345
                },
                {
                    _id: "test-pending-1",
                    ingredients: ["643d69a5c3f7b9001cfa093d"],
                    status: "pending",
                    name: "Тестовый заказ в работе",
                    createdAt: "2024-01-01T13:00:00.000Z",
                    updatedAt: "2024-01-01T13:00:00.000Z",
                    number: 12346
                }
            ],
            total: 2,
            totalToday: 1
        }).as('getTestOrdersColors');

        cy.intercept('GET', 'api/ingredients', {
            success: true,
            data: [
                {
                    _id: "643d69a5c3f7b9001cfa093c",
                    name: "Тестовая булка",
                    type: "bun",
                    price: 100,
                    image_mobile: "test-image.png"
                },
                {
                    _id: "643d69a5c3f7b9001cfa093d",
                    name: "Тестовый ингредиент",
                    type: "main",
                    price: 200,
                    image_mobile: "test-image.png"
                }
            ]
        }).as('getTestIngredients');

        cy.visitPage(URLS.FEED);
        cy.wait('@getTestOrdersColors');
        cy.wait('@getTestIngredients');
        cy.get(SELECTORS.ORDERS_LIST, { timeout: 10000 }).should('be.visible');

        cy.get(SELECTORS.READY_ORDERS, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.READY_ORDERS_ITEM_12345, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.READY_ORDERS_ITEM_12345).should('have.css', 'color', 'rgb(0, 204, 204)');

        cy.get(SELECTORS.PENDING_ORDERS, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.PENDING_ORDERS_ITEM_12346, { timeout: 10000 }).should('be.visible');
        cy.get(SELECTORS.PENDING_ORDERS_ITEM_12346).should('have.css', 'color', 'rgb(242, 242, 243)');
    });

    // проверка функциональности кнопки обновления
    it('кнопка обновить должна обновлять данные', () => {
        cy.visitPage(URLS.FEED);
        cy.wait('@getFeedDebug');
        cy.wait('@getIngredients');

        cy.get(SELECTORS.ORDERS_LIST, { timeout: 10000 }).should('be.visible');

        // запоминаем количество карточек заказов до обновления
        cy.get(SELECTORS.ORDER_CARD, { timeout: 10000 }).then(($cards) => {
            const initialCount = $cards.length;
            console.log(`Initial orders count: ${initialCount}`);

            cy.get(SELECTORS.REFRESH_BUTTON).click();

            cy.wait(1000);

            // проверяем что карточки заказов остались (хотя бы одна)
            cy.get(SELECTORS.ORDER_CARD, { timeout: 10000 }).should('have.length.at.least', 1);

            // проверяем что кнопка остается видимой
            cy.get(SELECTORS.REFRESH_BUTTON).should('be.visible');

            // проверяем что нет ошибок загрузки
            cy.get('body').should('not.contain', 'Ошибка загрузки');
        });
    });

    // проверка модального окна
    it('должен открывать модальное окно с деталями заказа при клике', () => {
        cy.visitPage(URLS.FEED);
        cy.wait('@getFeedDebug');
        cy.wait('@getIngredients');

        cy.get(SELECTORS.ORDERS_LIST, { timeout: 10000 }).should('be.visible');

        cy.get(SELECTORS.ORDER_CARD, { timeout: 10000 }).first().click();

        // проверяем что модальное окно открылось
        cy.get(SELECTORS.MODAL, { timeout: 10000 }).should('be.visible');

        // проверяем что есть раздел "Состав:"
        cy.contains('Состав:').should('be.visible');

        cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
        cy.get(SELECTORS.MODAL).should('not.exist');
    });
});
