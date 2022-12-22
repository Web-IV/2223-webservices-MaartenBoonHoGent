
const { withServer, DATA  } = require('../helpers');
const { tables } = require('../../src/data');

describe('accounts', () => {
    let request;
    let knex;
    let authHeader;

    withServer(({ knex: k, request: r, authHeader: a }) => {
        knex = k;
        request = r;
        authHeader = a;
    });

    const ACCOUNTS_URL = `/api/accounts`;

    describe('GET /api/accounts', () => {
        it('should return all accounts', async () => {
            const response = await request.get(ACCOUNTS_URL).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(DATA.accounts.length);
            // Mails should be equal. The mails are unique, so we can use this to check if the accounts are equal
            const eMails = response.body.items.map(account => account['e-mail']);
            expect(eMails).toEqual(DATA.accounts.map(account => account['e-mail']));
        });
    });

    /**
     * Test case: GET /api/accounts/:accountNr
     */
    describe(('GET ' + ACCOUNTS_URL + '/:accountNr'), () => {
        it("should return a single account and a status code of 200", async () => {
            const response = await request.get(ACCOUNTS_URL + '/1').set('Authorization', authHeader); // Account is 4 because the database uses auto-increment
            expect(response.status).toBe(200);
            expect(response.body['e-mail']).toEqual(DATA.accounts[0]['e-mail']);
            expect(response.body['invested sum']).toEqual(DATA.accounts[0]['invested sum']);
        });
        // Attempt to get a non-existing account
        it("should return a status code of 404 if the account does not exist", async () => {
            const response = await request.get(ACCOUNTS_URL + '/4').set('Authorization', authHeader);
            expect(response.status).toBe(404);
        });
    });

    /** 
     * Test case: GET /api/accounts/email/:email
     */
    describe(('GET ' + ACCOUNTS_URL + '/e-mail/:e-mail'), () => {
        it("should return a single account and a status code of 200", async () => {
            const response = await request.get(ACCOUNTS_URL + '/e-mail/' + DATA.accounts[0]['e-mail']).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body['e-mail']).toEqual(DATA.accounts[0]['e-mail']);
            expect(response.body['invested sum']).toEqual(DATA.accounts[0]['invested sum']);
        });
        // Attempt to get a non-existing account
        it("should return a status code of 404 if the email doesn't exists", async () => {
            const response = await request.get(ACCOUNTS_URL + '/email/nonexistent@false.com').set('Authorization', authHeader);
            expect(response.status).toBe(404);
        });
    });

    /**
     * Test case: POST /api/accounts
     */
    describe(('POST ' + ACCOUNTS_URL), () => {
        it("should create a new account and return a status code of 201", async () => {
            const response = await request.post(ACCOUNTS_URL).send({
                "e-mail": 'tommy.doe@gmail.com',
                "date joined": 1651701600,
                "invested sum": 1000.0
            }).set('Authorization', authHeader);
            expect(response.status).toBe(201);
            //expect(response.body['accountNr']).toEqual(4);
            expect(response.body['e-mail']).toEqual('tommy.doe@gmail.com');
            expect(response.body['invested sum']).toEqual(1000.0);

        });

        // Attempt to create an account with an existing e-mail
        it("should return a status code of 409 if the accountNr already exists", async () => {
            const response = await request.post(ACCOUNTS_URL).send({
                "e-mail": 'tom.doe@gmail.com',
                "date joined": 1651701600,
                "invested sum": 1000.0
            }).set('Authorization', authHeader);
            expect(response.status).toBe(409);

        });
    });

    /**
    * Test case: PUT /api/accounts/:accountNr
    *  
    */
    describe(('PUT ' + ACCOUNTS_URL + '/:accountNr'), () => {
        it("should update an existing account and return a status code of 200", async () => {
            const dummyData = {
                "e-mail": 'thomas.doe@hotmail.com',
                "date joined": 1651701600,
                "invested sum": 5000.0
            };
            // Get the id of the account to update
            const response = await request.put(ACCOUNTS_URL + "/3").send(dummyData).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body['accountNr']).toEqual(3);
            expect(response.body['e-mail']).toEqual(dummyData['e-mail']);
            expect(response.body['invested sum']).toEqual(dummyData['invested sum']);
        });
        // Attempt to update a non-existing account
        it("should return a status code of 404 if the account does not exist", async () => {
            const dummyData = {
                "e-mail": 'thomas.doe@hotmail.com',
                "date joined": 1651701600,
                "invested sum": 5000.0
            };
            const response = await request.put(ACCOUNTS_URL + '/999999').send(dummyData).set('Authorization', authHeader);
            expect(response.status).toBe(404);

        });
        // Attempt to update an account with an existing e-mail
        it("should return a status code of 409 if the e-mail already exists", async () => {
            const dummyData = {
                "e-mail": 'tom.doe@gmail.com',
                "date joined": 1651701600,
                "invested sum": 5000.0
            };
            const response = await request.put(ACCOUNTS_URL + '/2').send(dummyData).set('Authorization', authHeader);
            expect(response.status).toBe(409);

        });
    });

    describe(('DELETE ' + ACCOUNTS_URL + '/:accountNr'), () => {
        it("should delete an existing account and return a status code of 204", async () => {
            const response = await request.delete(ACCOUNTS_URL + `/3`).set('Authorization', authHeader);
            expect(response.status).toBe(204);
        });

        // Attempt to delete a non-existing account
        it("should return a status code of 404 if the account does not exist", async () => {
            const response = await request.delete(ACCOUNTS_URL + '/99999').set('Authorization', authHeader);
            expect(response.status).toBe(404);
        });
    });
});
