/// <reference types="cypress" />

describe('Smoke тест - базовая функциональность', () => {
    beforeEach(() => {
        // перехватываем запросы к API
        cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    });

    it('должен загружать главную страницу', () => {
        cy.visit('/');
        cy.wait('@getIngredients');
        cy.contains('Соберите бургер').should('be.visible');
    });

    it('должен отображать ингредиенты', () => {
        cy.visit('/');
        cy.wait('@getIngredients');
        cy.contains('Булки').should('exist');
        cy.contains('Начинки').should('exist');
        cy.contains('Соусы').should('exist');

        // Проверяем наличие ингредиентов каждого типа
        cy.get('[data-testid="ingredient-bun"]').should('have.length.greaterThan', 0);
        cy.get('[data-testid="ingredient-main"]').should('have.length.greaterThan', 0);
        cy.get('[data-testid="ingredient-sauce"]').should('have.length.greaterThan', 0);

        // Проверяем кнопки добавления
        cy.get('[data-testid="add-button-bun"]').should('exist');
        cy.get('[data-testid="add-button-main"]').should('exist');
        cy.get('[data-testid="add-button-sauce"]').should('exist');
    });

    it('должен переходить на страницу входа', () => {
        cy.visit('/');
        cy.wait('@getIngredients');
        cy.contains('Личный кабинет').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/login');
        cy.contains('Вход').should('be.visible');
    });

    it('должен переходить на страницу регистрации', () => {
        cy.visit('/login');

        // переходим на страницу регистрации
        cy.contains('Зарегистрироваться').click();

        // Проверяем, что перешли на страницу регистрации
        cy.url().should('eq', Cypress.config().baseUrl + '/register');
        cy.contains('Регистрация').should('be.visible');
    });

    it('должен переходить на страницу ленты заказов', () => {
        cy.visit('/');
        cy.wait('@getIngredients');

        // переходим на страницу ленты заказов
        cy.contains('Лента заказов').click();

        // проверяем что перешли на страницу ленты заказов
        cy.url().should('eq', Cypress.config().baseUrl + '/feed');
        cy.contains('Лента заказов').should('be.visible');
    });
});
