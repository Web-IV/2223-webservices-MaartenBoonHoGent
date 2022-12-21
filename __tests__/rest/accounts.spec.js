
const { withServer } = require('../helpers');
const { tables } = require('../../src/data');

describe('Accounts', () => {
    // Lets
    let request;
    let knex;
    let authHeader;

    withServer(({ knex: k, request: r, authHeader: a }) => {
        knex = k;
        request = r;
        authHeader = a;
    });
    
    const url = `/api/accounts`;

    describe('GET /api/accounts', () => {
        it('should return all accounts', async () => {
            const response = await request.get(url).set('Authorization', authHeader);;
            expect(response.status).toBe(200);
        });
    });
});
