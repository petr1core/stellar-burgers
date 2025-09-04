/// <reference types="cypress" />

import { SELECTORS, URLS } from "../support/selectors";

describe('Smoke тест - базовая функциональность', () => {
    beforeEach(() => {
        // перехватываем запросы к API
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    });

    it('должен загружать главную страницу', () => {
        cy.visitPage(URLS.HOME);
        cy.wait('@getIngredients');
        cy.contains(SELECTORS.CONSTRUCTOR_PAGE_TITLE).should('be.visible');
    });

    it('должен отображать ингредиенты', () => {
        cy.visitPage(URLS.HOME);
        cy.wait('@getIngredients');
        cy.contains(SELECTORS.BUNS_CATEGORY_TEXT).should('exist');
        cy.contains(SELECTORS.MAINS_CATEGORY_TEXT).should('exist');
        cy.contains(SELECTORS.SAUCES_CATEGORY_TEXT).should('exist');

        // Проверяем наличие ингредиентов каждого типа
        cy.get(SELECTORS.INGREDIENT_BUN).should('have.length.greaterThan', 0);
        cy.get(SELECTORS.INGREDIENT_MAIN).should('have.length.greaterThan', 0);
        cy.get(SELECTORS.INGREDIENT_SAUCE).should('have.length.greaterThan', 0);

        // Проверяем кнопки добавления
        cy.get(SELECTORS.ADD_BUTTON_BUN).should('exist');
        cy.get(SELECTORS.ADD_BUTTON_MAIN).should('exist');
        cy.get(SELECTORS.ADD_BUTTON_SAUCE).should('exist');
    });

    it('должен переходить на страницу входа', () => {
        cy.visitPage(URLS.HOME);
        cy.wait('@getIngredients');
        cy.contains(SELECTORS.LOGIN_NAV_LINK).click();
        cy.url().should('eq', Cypress.config().baseUrl + URLS.LOGIN);
        cy.contains(SELECTORS.LOGIN_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу регистрации', () => {
        cy.visitPage(URLS.LOGIN);

        // переходим на страницу регистрации
        cy.contains(SELECTORS.REGISTER_NAV_LINK).click();

        // Проверяем, что перешли на страницу регистрации
        cy.url().should('eq', Cypress.config().baseUrl + URLS.REGISTER);
        cy.contains(SELECTORS.REGISTER_PAGE_TITLE).should('be.visible');
    });

    it('должен переходить на страницу ленты заказов', () => {
        cy.visitPage(URLS.HOME);
        cy.wait('@getIngredients');

        // переходим на страницу ленты заказов
        cy.contains(SELECTORS.FEED_NAV_LINK).click();

        // проверяем что перешли на страницу ленты заказов
        cy.url().should('eq', Cypress.config().baseUrl + URLS.FEED);
        cy.contains(SELECTORS.FEED_PAGE_TITLE).should('be.visible');
    });
});
