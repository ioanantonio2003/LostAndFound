describe('Authentication Flow', () => {
    beforeEach(() => {
        // Her test öncesi durumu sıfırla
        cy.request({
            method: 'POST',
            url: '/cypress/cleanup',
            failOnStatusCode: false
        });
    });

    it('should display register page', () => {
        cy.visit('/register.html');
        cy.get('form').should('exist');
        cy.get('input[name="username"]').should('exist');
        cy.get('input[name="email"]').should('exist');
        cy.get('input[name="password"]').should('exist');
    });

    it('should register a new user', () => {
        cy.visit('/register.html');

        // Form doldurma
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('testpass123');

        // Form gönderme
        cy.get('form').submit();

        // Login sayfasına yönlendirme kontrolü
        cy.url().should('include', '/login.html');
    });

    it('should not allow duplicate email registration', () => {
        // İlk kullanıcı kaydı
        cy.visit('/register.html');
        cy.get('input[name="username"]').type('testuser1');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('testpass123');
        cy.get('form').submit();

        // Aynı email ile ikinci kayıt denemesi
        cy.visit('/register.html');
        cy.get('input[name="username"]').type('testuser2');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('differentpass');
        cy.get('form').submit();

        // Hata mesajı kontrolü
        cy.contains('The adrress email is already used!');
    });

    it('should login successfully', () => {
        // Önce kullanıcı kaydı
        cy.visit('/register.html');
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('testpass123');
        cy.get('form').submit();

        // Login
        cy.visit('/login.html');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('testpass123');
        cy.get('form').submit();

        // Ana sayfaya yönlendirme kontrolü
        cy.url().should('include', '/main.html');
    });

    it('should not login with wrong credentials', () => {
        cy.visit('/login.html');
        cy.get('input[name="email"]').type('wrong@example.com');
        cy.get('input[name="password"]').type('wrongpass');
        cy.get('form').submit();

        cy.contains('The email address or the passwors are invalid');
    });
});