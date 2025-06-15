const request = require('supertest');
const app = require('../server');
const fs = require('fs');

// Test kullanıcısı
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpass123'
};

// Her testten sonra users.json'ı temizle
afterEach(() => {
    if (fs.existsSync('./users.json')) {
        fs.unlinkSync('./users.json');
    }
});

describe('Authentication Tests', () => {
    // Kayıt testi
    test('POST /register - başarılı kayıt', async () => {
        const response = await request(app)
            .post('/register')
            .send(testUser)
            .expect(302); // redirect status code

        expect(response.headers.location).toBe('/login.html');
    });

    // Aynı email ile tekrar kayıt testi
    test('POST /register - var olan email ile kayıt', async () => {
        // İlk kayıt
        await request(app)
            .post('/register')
            .send(testUser);

        // Aynı email ile tekrar kayıt
        const response = await request(app)
            .post('/register')
            .send(testUser)
            .expect(400);

        expect(response.text).toBe('The adrress email is already used!');
    });

    // Login testi
    test('POST /login - başarılı giriş', async () => {
        // Önce kullanıcıyı kaydet
        await request(app)
            .post('/register')
            .send(testUser);

        // Login dene
        const response = await request(app)
            .post('/login')
            .send({
                email: testUser.email,
                password: testUser.password
            })
            .expect(302);

        expect(response.headers.location).toBe('/main.html');
    });

    // Yanlış bilgilerle login testi
    test('POST /login - başarısız giriş', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'wrong@example.com',
                password: 'wrongpass'
            })
            .expect(401);

        expect(response.text).toBe('The email address or the passwors are invalid');
    });

    // Logout testi
    test('GET /logout - çıkış yapma', async () => {
        const response = await request(app)
            .get('/logout')
            .expect(302);

        expect(response.headers.location).toBe('/login.html');
    });
});