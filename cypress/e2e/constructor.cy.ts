/// <reference types="cypress" />

const loginUser = () => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/token', { fixture: 'user.json' }).as('refreshToken');

    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
};

describe('Конструктор бургера', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order.json' }).as('createOrder');
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/orders/*', { fixture: 'order.json' }).as('getOrderByNumber');

        cy.visit('/');
        cy.contains('Соберите бургер').should('be.visible');
        cy.contains('Булки').should('be.visible');
        cy.contains('Начинки').should('be.visible');
        cy.contains('Соусы').should('be.visible');
    });

    it('должен отображать список ингредиентов', () => {
        cy.contains('Соберите бургер').should('be.visible');
        cy.get('[data-testid="ingredient-bun"]').should('have.length.at.least', 1);
    });

    it('должен переключаться между табами категорий ингредиентов', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');

        cy.contains('Начинки').click();
        cy.wait(500); // время на скроллинг
        cy.get('[data-testid="ingredient-main"]').should('be.visible');

        cy.contains('Соусы').click();
        cy.wait(500);
        cy.get('[data-testid="ingredient-sauce"]').should('be.visible');

        cy.contains('Булки').click();
        cy.wait(500);
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');
    });

    it('должен добавлять ингредиент в конструктор при клике на кнопку "Добавить"', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');
        cy.wait('@getIngredients');

        // кнопка "Добавить" у первого ингредиента-булки сработала
        cy.get('[data-testid="add-button-bun"]').first().find('button').should('be.visible').click();

        // ингредиент появился в конструкторе
        cy.get('[data-testid="constructor-bun-top"]').should('be.visible');
        cy.get('[data-testid="constructor-bun-bottom"]').should('be.visible');
    });

    it('должен открывать модальное окно с описанием ингредиента при клике', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');

        cy.get('[data-testid="ingredient-bun"]').first().click();

        // модальное окно открылось
        cy.get('[data-testid="ingredient-details-modal"]').should('be.visible');

        // отображается название ингредиента
        cy.get('[data-testid="ingredient-details-modal"] h3').should('be.visible');
    });

    it('должен отображать данные именно того ингредиента, по которому произошёл клик', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');

        // минимум 2 ингредиента для сравнения
        cy.get('[data-testid="ingredient-bun"]').should('have.length.at.least', 2);

        // название первого ингредиента
        cy.get('[data-testid="ingredient-bun"]').first().find('p').last().invoke('text').as('firstIngredientName');

        // название второго ингредиента
        cy.get('[data-testid="ingredient-bun"]').eq(1).find('p').last().invoke('text').as('secondIngredientName');

        // названия разные
        cy.get('@firstIngredientName').then((firstName) => {
            cy.get('@secondIngredientName').then((secondName) => {
                expect(firstName).to.not.equal(secondName);
            });
        });

        // первый ингредиент
        cy.get('[data-testid="ingredient-bun"]').first().click();
        cy.get('[data-testid="ingredient-details-modal"]').should('be.visible');

        // название первого ингредиента
        cy.get('@firstIngredientName').then((firstName) => {
            cy.get('[data-testid="ingredient-details-modal"] h3').should('contain.text', firstName);
        });

        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="ingredient-details-modal"]').should('not.exist');

        // второй ингредиент
        cy.get('[data-testid="ingredient-bun"]').eq(1).click();
        cy.get('[data-testid="ingredient-details-modal"]').should('be.visible');

        // Проверяем, что в модальном окне название второго ингредиента
        cy.get('@secondIngredientName').then((secondName) => {
            cy.get('[data-testid="ingredient-details-modal"] h3').should('contain.text', secondName);
        });

        // это не название первого ингредиента!
        cy.get('@firstIngredientName').then((firstName) => {
            cy.get('[data-testid="ingredient-details-modal"] h3').should('not.contain.text', firstName);
        });

        // Закрываем модальное окно
        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="ingredient-details-modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно при клике по кнопке закрытия', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');

        cy.get('[data-testid="ingredient-bun"]').first().click();
        cy.get('[data-testid="ingredient-details-modal"]').should('be.visible');

        // Закрываем модальное окно
        cy.get('[data-testid="modal-close-button"]').click();

        cy.get('[data-testid="ingredient-details-modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно при клике по оверлею', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');


        cy.get('[data-testid="ingredient-bun"]').first().click();
        cy.get('[data-testid="ingredient-details-modal"]').should('be.visible');

        // Кликаем по оверлею
        cy.get('[data-testid="modal-overlay"]').click({ force: true });


        cy.get('[data-testid="ingredient-details-modal"]').should('not.exist');
    });

    it('должен создавать заказ при добавлении ингредиентов и клике на кнопку оформления', () => {
        loginUser(); // авторизация для создания заказа
        cy.reload();
        cy.contains('Соберите бургер').should('be.visible');

        cy.get('[data-testid="ingredient-bun"]').should('be.visible');
        cy.get('[data-testid="add-button-bun"]').first().find('button').click();

        cy.contains('Начинки').click();
        cy.wait(500);
        cy.get('[data-testid="ingredient-main"]').should('be.visible');
        cy.get('[data-testid="add-button-main"]').first().find('button').click();

        cy.get('[data-testid="order-button"] button').should('not.be.disabled');
        cy.get('[data-testid="order-button"] button').click();
        cy.wait('@createOrder');

        cy.get('[data-testid="order-details-modal"]').should('be.visible');
        cy.contains('12345').should('be.visible');
    });

    it('должен очищать конструктор после создания заказа', () => {
        loginUser();
        cy.reload();
        cy.contains('Соберите бургер').should('be.visible');

        cy.get('[data-testid="ingredient-bun"]').should('be.visible');
        cy.get('[data-testid="add-button-bun"]').first().find('button').click();

        cy.contains('Начинки').click();
        cy.wait(500);
        cy.get('[data-testid="add-button-main"]').first().find('button').click();

        cy.get('[data-testid="order-button"] button').click();
        cy.wait('@createOrder');
        cy.get('[data-testid="modal-close-button"]').click();

        // проверяем очистку конструктора
        cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
        cy.get('[data-testid="constructor-bun-bottom"]').should('not.exist');
        cy.get('[data-testid="constructor-ingredients-area"]').should('not.contain', 'li');
        cy.get('[data-testid="order-button"] button').should('be.disabled');
    });

    it('должен отображать правильную цену заказа', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');
        cy.get('[data-testid="add-button-bun"]').first().find('button').click();

        cy.contains('Начинки').click();
        cy.wait(500);
        cy.get('[data-testid="add-button-main"]').first().find('button').click();

        cy.get('[data-testid="total-price"]').should('be.visible').and('not.contain', '0');
    });

    it('должен блокировать кнопку оформления заказа при пустом конструкторе', () => {
        cy.get('[data-testid="order-button"] button').should('be.disabled');
    });

    it('должен блокировать кнопку оформления заказа без булки', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');

        cy.contains('Начинки').click();
        cy.wait(500);
        cy.get('[data-testid="add-button-main"]').first().find('button').click();

        cy.get('[data-testid="order-button"] button').should('be.disabled');
    });

    it('должен блокировать кнопку оформления заказа без ингредиентов', () => {
        cy.get('[data-testid="ingredient-bun"]').should('be.visible');
        cy.get('[data-testid="add-button-bun"]').first().find('button').click();

        cy.get('[data-testid="order-button"] button').should('be.disabled');
    });
});