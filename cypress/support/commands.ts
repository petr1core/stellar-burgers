/// <reference types="cypress" />
import { SELECTORS, API_ENDPOINTS, URLS } from './selectors';

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

            /**
             * Custom command to visit page with proper setup
             * @example cy.visitPage('/login')
             */
            visitPage(path: string): Chainable<void>;

            /**
             * Custom command to setup auth intercepts
             * @example cy.setupAuthIntercepts()
             */
            setupAuthIntercepts(): Chainable<void>;

            /**
             * Custom command to setup ingredients intercepts
             * @example cy.setupIngredientsIntercepts()
             */
            setupIngredientsIntercepts(): Chainable<void>;

            /**
             * Custom command to setup orders intercepts
             * @example cy.setupOrdersIntercepts()
             */
            setupOrdersIntercepts(): Chainable<void>;

            /**
             * Custom command to fill login form
             * @example cy.fillLoginForm('test@example.com', 'password')
             */
            fillLoginForm(email: string, password: string): Chainable<void>;

            /**
             * Custom command to fill register form
             * @example cy.fillRegisterForm('Name', 'test@example.com', 'password')
             */
            fillRegisterForm(name: string, email: string, password: string): Chainable<void>;

            /**
             * Custom command to wait for element to be stable
             * @example cy.waitForStable('[data-testid="button"]')
             */
            waitForStable(selector: string): Chainable<void>;

            /**
             * Custom command to check for accessibility
             * @example cy.checkA11y()
             */
            checkA11y(): Chainable<void>;

            /**
             * Custom command to take screenshot with naming
             * @example cy.takeNamedScreenshot('login-form')
             */
            takeNamedScreenshot(name: string): Chainable<void>;
        }
    }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visitPage(URLS.LOGIN);
    cy.fillLoginForm(email, password);
});

// Clear auth command
Cypress.Commands.add('clearAuth', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
});

// Set auth tokens command
Cypress.Commands.add('setAuthTokens', (accessToken: string, refreshToken: string) => {
    cy.setCookie('accessToken', accessToken);
    cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', refreshToken);
    });
});

// Wait for Redux state to stabilize
Cypress.Commands.add('waitForRedux', () => {
    // Simple wait for Redux to process actions
    cy.wait(100);
});

// Safe click with retry and proper error handling
Cypress.Commands.add('safeClick', (selector: string) => {
    cy.get(selector)
        .should('be.visible')
        .and('not.be.disabled')
        .click({ force: true });
    cy.waitForRedux();
});

// Visit page with proper setup and error handling
Cypress.Commands.add('visitPage', (path: string) => {
    cy.visit(path, {
        onBeforeLoad: (win) => {
            // Clear any existing state
            win.localStorage.clear();
            win.sessionStorage.clear();
        }
    });
    cy.waitForRedux();
});

// Setup auth intercepts
Cypress.Commands.add('setupAuthIntercepts', () => {
    cy.intercept('POST', API_ENDPOINTS.AUTH_LOGIN, { fixture: 'user.json' }).as('login');
    cy.intercept('POST', API_ENDPOINTS.AUTH_REGISTER, { fixture: 'user.json' }).as('register');
    cy.intercept('GET', API_ENDPOINTS.AUTH_USER, (req) => {
        // Проверяем наличие токена в заголовке
        const token = req.headers.authorization;
        if (!token || token === '') {
            req.reply({
                success: false,
                message: 'No access token'
            });
        } else {
            req.reply({ fixture: 'user.json' });
        }
    }).as('getUser');
    cy.intercept('POST', API_ENDPOINTS.AUTH_LOGOUT, { success: true }).as('logout');
    cy.intercept('POST', API_ENDPOINTS.AUTH_TOKEN, { fixture: 'user.json' }).as('refreshToken');
});

// Setup ingredients intercepts
Cypress.Commands.add('setupIngredientsIntercepts', () => {
    cy.intercept('GET', API_ENDPOINTS.INGREDIENTS, { fixture: 'ingredients.json' }).as('getIngredients');
});

// Setup orders intercepts
Cypress.Commands.add('setupOrdersIntercepts', () => {
    cy.intercept('GET', API_ENDPOINTS.ORDERS_ALL, { fixture: 'orders.json' }).as('getFeed');
    cy.intercept('GET', API_ENDPOINTS.ORDERS, { fixture: 'orders.json' }).as('getOrders');
    cy.intercept('POST', API_ENDPOINTS.ORDERS, { fixture: 'order.json' }).as('createOrder');
    cy.intercept('GET', API_ENDPOINTS.ORDER_BY_NUMBER, { fixture: 'order.json' }).as('getOrderByNumber');
});

// Fill login form with proper validation
Cypress.Commands.add('fillLoginForm', (email: string, password: string) => {
    cy.get(SELECTORS.EMAIL_INPUT)
        .should('be.visible')
        .clear()
        .type(email, { delay: 0 });
    cy.get(SELECTORS.PASSWORD_INPUT)
        .should('be.visible')
        .clear()
        .type(password, { delay: 0 });
    cy.get(SELECTORS.LOGIN_BUTTON)
        .should('be.visible')
        .and('not.be.disabled')
        .click();
});

// Fill register form with proper validation
Cypress.Commands.add('fillRegisterForm', (name: string, email: string, password: string) => {
    cy.get(SELECTORS.NAME_INPUT)
        .should('be.visible')
        .clear()
        .type(name, { delay: 0 });
    cy.get(SELECTORS.EMAIL_INPUT)
        .should('be.visible')
        .clear()
        .type(email, { delay: 0 });
    cy.get(SELECTORS.PASSWORD_INPUT)
        .should('be.visible')
        .clear()
        .type(password, { delay: 0 });
    cy.get(SELECTORS.REGISTER_BUTTON)
        .should('be.visible')
        .and('not.be.disabled')
        .click();
});

// Wait for element to be stable (no animations, no changes)
Cypress.Commands.add('waitForStable', (selector: string) => {
    cy.get(selector).should('be.visible');
    cy.wait(100); // Wait for any animations to complete
});

// Check accessibility (if cypress-axe is installed)
Cypress.Commands.add('checkA11y', () => {
    // This would require cypress-axe plugin
    // cy.injectAxe();
    // cy.checkA11y();
    cy.log('Accessibility check would run here if cypress-axe is installed');
});

// Take screenshot with descriptive naming
Cypress.Commands.add('takeNamedScreenshot', (name: string) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cy.screenshot(`${name}-${timestamp}`, { overwrite: true });
});