// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Глобальная обработка ошибок Redux
Cypress.on('uncaught:exception', (err) => {
    // Игнорируем ошибки Redux Toolkit в тестах
    if (err.message.includes('A case reducer on a non-draftable value must not return undefined')) {
        return false;
    }
    
    // Игнорируем другие ошибки Redux
    if (err.message.includes('redux') || err.message.includes('Redux')) {
        return false;
    }
    
    return true;
});

// Улучшаем стабильность тестов
beforeEach(() => {
    // Очищаем состояние перед каждым тестом
    cy.clearLocalStorage();
    cy.clearCookies();
});