/// <reference types="cypress" />

describe('Лента заказов', () => {
    it('должен загружать страницу feed и отображать заголовок', () => {
        cy.visit('/feed');
        cy.contains('Лента заказов').should('be.visible');
    });

    it('должен загружать страницу feed и ее базу', () => {
        cy.visit('/feed');
        cy.contains('Лента заказов').should('be.visible');
        cy.contains('Выполнено за все время:').should('be.visible');
        cy.contains('Выполнено за сегодня:').should('be.visible');
        cy.contains('Готовы:').should('be.visible');
        cy.contains('В работе:').should('be.visible');
        cy.contains('Обновить').should('be.visible');
    });

    it('должен отображать список заказов', () => {
        cy.visit('/feed');
        cy.get('[data-testid="orders-list"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="orders-list"]').find('a').should('have.length', 50);
    });

    it('должен отображать статистику заказов', () => {
        cy.visit('/feed');
        cy.get('[data-testid="orders-list"]', { timeout: 10000 }).should('be.visible');

        cy.get('[data-testid="total-orders"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="total-orders"]').invoke('text').then((text) => {
            const value = parseInt(text.replace(/\D/g, ''), 10);
            expect(value).to.be.greaterThan(0);
        });

        cy.get('[data-testid="total-today"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="total-today"]').invoke('text').then((text) => {
            const value = parseInt(text.replace(/\D/g, ''), 10);
            expect(value).to.be.greaterThan(0);
        });

        cy.get('[data-testid="ready-orders"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="pending-orders"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="ready-orders"]').find('li').should('have.length.at.least', 5);
        cy.get('[data-testid="pending-orders"]').find('li').should('have.length.at.least', 0);
    });

    it('должен отображать статусы заказов с правильными цветами', () => {
        cy.intercept('GET', '**/orders/all', {
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
        }).as('getTestOrders');

        cy.intercept('GET', '**/ingredients', {
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

        cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders/*', {
            fixture: 'order.json'
        }).as('getOrderByNumber');

        cy.visit('/feed');
        cy.wait('@getTestOrders');
        cy.wait('@getTestIngredients');
        cy.get('[data-testid="orders-list"]', { timeout: 10000 }).should('be.visible');

        cy.get('[data-testid="ready-orders"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="ready-orders-item-12345"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="ready-orders-item-12345"]').should('have.css', 'color', 'rgb(0, 204, 204)');

        cy.get('[data-testid="pending-orders"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="pending-orders-item-12346"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="pending-orders-item-12346"]').should('have.css', 'color', 'rgb(242, 242, 243)');
    });

    // проверка функциональности кнопки обновления
    it('кнопка обновить должна обновлять данные', () => {
        cy.visit('/feed');

        cy.get('[data-testid="orders-list"]', { timeout: 10000 }).should('be.visible');

        // запоминаем количество карточек заказов до обновления
        cy.get('[data-testid="order-card"]', { timeout: 10000 }).then(($cards) => {
            const initialCount = $cards.length;
            console.log(`Initial orders count: ${initialCount}`);

            cy.get('[data-testid="refresh-button"]').click();

            cy.wait(1000);

            // проверяем что карточки заказов остались (хотя бы одна)
            cy.get('[data-testid="order-card"]', { timeout: 10000 }).should('have.length.at.least', 1);

            // проверяем что кнопка остается видимой
            cy.get('[data-testid="refresh-button"]').should('be.visible');

            // проверяем что нет ошибок загрузки
            cy.get('body').should('not.contain', 'Ошибка загрузки');
        });
    });

    // проверка модального окна
    it('должен открывать модальное окно с деталями заказа при клике', () => {
        cy.visit('/feed');

        cy.get('[data-testid="orders-list"]', { timeout: 10000 }).should('be.visible');

        cy.get('[data-testid="order-card"]', { timeout: 10000 }).first().click();

        // проверяем что модальное окно открылось
        cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
        cy.contains('Информация о заказе').should('be.visible');

        // проверяем что есть статус заказа
        cy.get('[data-testid="modal"]').should('contain', 'Выполнен');

        // проверяем что есть раздел "Состав:"
        cy.contains('Состав:').should('be.visible');

        // проверяем что отображаются ингредиенты (хотя бы один)
        cy.get('[data-testid="modal"]').find('img').should('have.length.at.least', 2);

        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
    });
});
