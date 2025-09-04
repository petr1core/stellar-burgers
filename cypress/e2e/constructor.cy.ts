/// <reference types="cypress" />
import { SELECTORS, API_ENDPOINTS, URLS } from '../support/selectors';

const loginUser = () => {
    cy.setupAuthIntercepts();
    cy.setAuthTokens('Bearer test-access-token', 'test-refresh-token');
};


describe('Конструктор бургера', () => {
    beforeEach(() => {
        cy.setupIngredientsIntercepts();
        cy.setupOrdersIntercepts();
        cy.clearAuth();

        cy.visitPage(URLS.HOME);
        cy.contains(SELECTORS.CONSTRUCTOR_TITLE).should('be.visible');
        cy.contains(SELECTORS.BUNS_CATEGORY).should('be.visible');
        cy.contains(SELECTORS.MAINS_CATEGORY).should('be.visible');
        cy.contains(SELECTORS.SAUCES_CATEGORY).should('be.visible');
    });

    it('должен отображать список ингредиентов', () => {
        cy.contains(SELECTORS.CONSTRUCTOR_TITLE).should('be.visible');
        cy.get(SELECTORS.INGREDIENT_BUN).should('have.length.at.least', 1);
    });

    it('должен переключаться между табами категорий ингредиентов', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');

        cy.contains(SELECTORS.MAINS_CATEGORY).click();
        cy.waitForStable(SELECTORS.INGREDIENT_MAIN);
        cy.get(SELECTORS.INGREDIENT_MAIN).should('be.visible');

        cy.contains(SELECTORS.SAUCES_CATEGORY).click();
        cy.waitForStable(SELECTORS.INGREDIENT_SAUCE);
        cy.get(SELECTORS.INGREDIENT_SAUCE).should('be.visible');

        cy.contains(SELECTORS.BUNS_CATEGORY).click();
        cy.waitForStable(SELECTORS.INGREDIENT_BUN);
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');
    });

    it('должен добавлять ингредиент в конструктор при клике на кнопку "Добавить"', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');
        cy.wait('@getIngredients');

        cy.get(SELECTORS.ADD_BUTTON_BUN).first().find('button').should('be.visible').click();

        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('be.visible');
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('be.visible');
    });

    it('должен открывать модальное окно с описанием ингредиента при клике', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');

        cy.get(SELECTORS.INGREDIENT_BUN).first().click();

        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('be.visible');
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL + ' h3').should('be.visible');
    });

    it('должен отображать данные именно того ингредиента, по которому произошёл клик', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');
        cy.get(SELECTORS.INGREDIENT_BUN).should('have.length.at.least', 2);

        // Получаем имя первого ингредиента
        cy.get(SELECTORS.INGREDIENT_BUN).first().find('p').last().should('be.visible').invoke('text').as('firstIngredientName');

        // Кликаем на первый ингредиент
        cy.get(SELECTORS.INGREDIENT_BUN).first().click();
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('be.visible');

        // Проверяем, что отображается имя первого ингредиента
        cy.get('@firstIngredientName').then((firstName) => {
            cy.log('First ingredient name:', firstName);
            // Ждем, пока модальное окно полностью загрузится
            cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL + ' h3').should('be.visible');
            cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL + ' h3').should('contain.text', firstName);
        });

        // Закрываем модальное окно
        cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('not.exist');

        // Получаем имя второго ингредиента
        cy.get(SELECTORS.INGREDIENT_BUN).eq(1).find('p').last().should('be.visible').invoke('text').as('secondIngredientName');

        // Кликаем на второй ингредиент
        cy.get(SELECTORS.INGREDIENT_BUN).eq(1).click();
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('be.visible');

        // Проверяем, что отображается имя второго ингредиента
        cy.get('@secondIngredientName').then((secondName) => {
            cy.log('Second ingredient name:', secondName);
            // Ждем, пока модальное окно полностью загрузится
            cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL + ' h3').should('be.visible');
            cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL + ' h3').should('contain.text', secondName);
        });

        // Закрываем модальное окно
        cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('not.exist');
    });

    it('должен закрывать модальное окно при клике по кнопке закрытия', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');

        cy.get(SELECTORS.INGREDIENT_BUN).first().click();
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('be.visible');

        cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('not.exist');
    });

    it('должен закрывать модальное окно при клике по оверлею', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');

        cy.get(SELECTORS.INGREDIENT_BUN).first().click();
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('be.visible');

        cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
        cy.get(SELECTORS.INGREDIENT_DETAILS_MODAL).should('not.exist');
    });

    it('должен создавать заказ при добавлении ингредиентов и клике на кнопку оформления', () => {
        loginUser();
        cy.reload();
        cy.contains(SELECTORS.CONSTRUCTOR_TITLE).should('be.visible');

        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');
        cy.get(SELECTORS.ADD_BUTTON_BUN).first().find('button').click();

        cy.contains(SELECTORS.MAINS_CATEGORY).click();
        cy.waitForStable(SELECTORS.INGREDIENT_MAIN);
        cy.get(SELECTORS.INGREDIENT_MAIN).should('be.visible');
        cy.get(SELECTORS.ADD_BUTTON_MAIN).first().find('button').click();

        cy.get(SELECTORS.ORDER_BUTTON + ' button').should('not.be.disabled');
        cy.get(SELECTORS.ORDER_BUTTON + ' button').click();
        cy.wait('@createOrder');

        cy.get(SELECTORS.ORDER_DETAILS_MODAL).should('be.visible');
        cy.contains('12345').should('be.visible');
    });

    it('должен очищать конструктор после создания заказа', () => {
        loginUser();
        cy.reload();
        cy.contains(SELECTORS.CONSTRUCTOR_TITLE).should('be.visible');

        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');
        cy.get(SELECTORS.ADD_BUTTON_BUN).first().find('button').click();

        cy.contains(SELECTORS.MAINS_CATEGORY).click();
        cy.waitForStable(SELECTORS.INGREDIENT_MAIN);
        cy.get(SELECTORS.ADD_BUTTON_MAIN).first().find('button').click();

        cy.get(SELECTORS.ORDER_BUTTON).find('button').click();
        cy.wait('@createOrder');
        cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();

        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS_AREA).should('not.contain', 'li');
        cy.get(SELECTORS.ORDER_BUTTON).find('button').should('be.disabled');
    });

    it('должен отображать правильную цену заказа', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');
        cy.get(SELECTORS.ADD_BUTTON_BUN).first().find('button').click();

        cy.contains(SELECTORS.MAINS_CATEGORY).click();
        cy.waitForStable(SELECTORS.INGREDIENT_MAIN);
        cy.get(SELECTORS.ADD_BUTTON_MAIN).first().find('button').click();

        cy.get(SELECTORS.TOTAL_PRICE).should('be.visible').and('not.contain', '0');
    });

    it('должен блокировать кнопку оформления заказа при пустом конструкторе', () => {
        cy.get(SELECTORS.ORDER_BUTTON).find('button').should('be.disabled');
    });

    it('должен блокировать кнопку оформления заказа без булки', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');

        cy.contains(SELECTORS.MAINS_CATEGORY).click();
        cy.waitForStable(SELECTORS.INGREDIENT_MAIN);
        cy.get(SELECTORS.ADD_BUTTON_MAIN).first().find('button').click();

        cy.get(SELECTORS.ORDER_BUTTON).find('button').should('be.disabled');
    });

    it('должен блокировать кнопку оформления заказа без ингредиентов', () => {
        cy.get(SELECTORS.INGREDIENT_BUN).should('be.visible');
        cy.get(SELECTORS.ADD_BUTTON_BUN).first().find('button').click();

        cy.get(SELECTORS.ORDER_BUTTON).find('button').should('be.disabled');
    });
});
