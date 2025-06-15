// Custom commands
Cypress.Commands.add('cleanupUsers', () => {
    cy.request({
        method: 'POST',
        url: '/cypress/cleanup',
        failOnStatusCode: false
    });
});

Cypress.Commands.add('register', (username, email, password) => {
    cy.visit('/register.html');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('form').submit();
});

Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login.html');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('form').submit();
});