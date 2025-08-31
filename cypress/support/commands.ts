/// <reference types="cypress" />

// Custom commands for testing
declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to login user
             * @example cy.login('test@example.com', 'password')
             */
            login(email: string, password: string): Chainable<void>;

            /**
             * Custom command to clear localStorage and cookies
             * @example cy.clearAuth()
             */
            clearAuth(): Chainable<void>;

            /**
             * Custom command to set auth tokens
             * @example cy.setAuthTokens('access-token', 'refresh-token')
             */
            setAuthTokens(accessToken: string, refreshToken: string): Chainable<void>;

            /**
             * Custom command to wait for Redux state to stabilize
             * @example cy.waitForRedux()
             */
            waitForRedux(): Chainable<void>;

            /**
             * Custom command to safely click with retry
             * @example cy.safeClick('[data-testid="button"]')
             */
            safeClick(selector: string): Chainable<void>;
        }
    }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
});

// Clear auth command
Cypress.Commands.add('clearAuth', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
});

// Set auth tokens command
Cypress.Commands.add('setAuthTokens', (accessToken: string, refreshToken: string) => {
    cy.setCookie('accessToken', accessToken);
    cy.setCookie('refreshToken', refreshToken);
});

// Wait for Redux state to stabilize
Cypress.Commands.add('waitForRedux', () => {
    // Wait a bit for Redux to process actions
    cy.wait(1000);
});

// Safe click with retry
Cypress.Commands.add('safeClick', (selector: string) => {
    cy.get(selector).should('be.visible').click({ force: true });
    cy.waitForRedux();
});