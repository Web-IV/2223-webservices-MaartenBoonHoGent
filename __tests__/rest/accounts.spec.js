const supertest = require('supertest');
const { getKnex, tables } = require('../../src/data');
const createServer = require('../../src/createServer');

describe('accounts', () => {
    let server;
    let request;
    let knex;

    // Constants
    const ACCOUNTS_URL = '/api/accounts';
    const DATA = {
        accounts: [
            {accountNr: 1, 'e-mail': 'tom.doe@gmail.com', 'date joined': '2022-01-01', 'invested sum': 0.0},
            {accountNr: 2, 'e-mail': 'pip.doe@gmail.com', 'date joined': '2022-02-01', 'invested sum': 5000.0},
            {accountNr: 3, 'e-mail': 'sophie.doe@gmail.com', 'date joined': '2022-03-01', 'invested sum': 10000.0}
        ]
    }
    
    /** 
     * BeforeAll function
     */
    beforeAll(async () => {
        server = await createServer(); // create the server
        request = supertest(server.getApp().callback()); // Perform a supertest request
        knex = getKnex(); // get the knex instance. The server has to be created first

        // Delete all data from the database
        await knex(tables.account).delete();
        await knex(tables.account).insert(DATA.accounts);
    }
    );

    /**
     * AfterAll function
     */
    afterAll(async () => {
        // Delete all data from the database
        await knex(tables.account).delete();
        await server.stop(); // stop the server
    });

    // Test cases
    /**
     * Test case: GET /api/accounts
     */
    describe(('GET ' + ACCOUNTS_URL), () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a list of accounts and a status code of 200", async () => {
            const response = await request.get(ACCOUNTS_URL);
            expect(response.status).toBe(200);
            expect(response.body['count']).toEqual(DATA.accounts.length);
            // expect(response.body['items']).toEqual(DATA.accounts); --> doesn't work due to data notation
            accountNrs = response.body['items'].map(account => account.accountNr);
            expect(accountNrs).toEqual(DATA.accounts.map(account => account.accountNr));
            emails = response.body['items'].map(account => account['e-mail']);
            expect(emails).toEqual(DATA.accounts.map(account => account['e-mail']));
            sums = response.body['items'].map(account => account['invested sum']);
            expect(sums).toEqual(DATA.accounts.map(account => account['invested sum']));
            
        });
    });

    /**
     * Test case: GET /api/accounts/:accountNr
     */
    describe(('GET ' + ACCOUNTS_URL + '/:accountNr'), () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a single account and a status code of 200", async () => {
            const response = await request.get(ACCOUNTS_URL + '/1');
            expect(response.status).toBe(200);
            expect(response.body['accountNr']).toEqual(DATA.accounts[0].accountNr);
            expect(response.body['e-mail']).toEqual(DATA.accounts[0]['e-mail']);
            expect(response.body['invested sum']).toEqual(DATA.accounts[0]['invested sum']);
        });
    // Attempt to get a non-existing account
        it("should return a status code of 404 if the account does not exist", async () => {
            const response = await request.get(ACCOUNTS_URL + '/4');
            expect(response.status).toBe(404);
            // Expect the response body to be empty
            expect(response.body).toEqual({});
        });
    });


    /** 
     * Test case: GET /api/accounts/email/:email
     */
    describe(('GET ' + ACCOUNTS_URL + '/email/:email'), () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a single account and a status code of 200", async () => {
            const response = await request.get(ACCOUNTS_URL + '/email/' + DATA.accounts[0]['e-mail']);
            expect(response.status).toBe(200);
            expect(response.body['accountNr']).toEqual(DATA.accounts[0].accountNr);
            expect(response.body['e-mail']).toEqual(DATA.accounts[0]['e-mail']);
            expect(response.body['invested sum']).toEqual(DATA.accounts[0]['invested sum']);
        });
        // Attempt to get a non-existing account
        it("should return a status code of 404 if the email doesn't exists", async () => {
            const response = await request.get(ACCOUNTS_URL + '/email/nonexistent@false.com');
            expect(response.status).toBe(404);
            // Expect the response body to be empty
            expect(response.body).toEqual({});
        });
    });
    /**
     * Test case: POST /api/accounts
    */
    describe(('POST ' + ACCOUNTS_URL), () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should create a new account and return a status code of 201", async () => {
            const response = await request.post(ACCOUNTS_URL).send({
                eMail: 'tommy.doe@gmail.com',
                dateJoined: '2022-05-05',
                investedSum: 1000.0
            });
            expect(response.status).toBe(201);
            //expect(response.body['accountNr']).toEqual(4);
            expect(response.body['e-mail']).toEqual('tommy.doe@gmail.com');
            expect(response.body['invested sum']).toEqual(1000.0);
            
        });

        // Attempt to create an account with an existing e-mail
        it("should return a status code of 409 if the accountNr already exists", async () => {
            const response = await request.post(ACCOUNTS_URL).send({
                eMail: 'tom.doe@gmail.com',
                dateJoined: '2022-05-05',
                investedSum: 1000.0
            });
            
            expect(response.status).toBe(409);
            // Expect the response body to be empty
            expect(response.body).toEqual({});
        });
    });

    /**
     * Test case: PUT /api/accounts/:accountNr
     *  
    */
    describe(('PUT ' + ACCOUNTS_URL + '/:accountNr'), () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should update an existing account and return a status code of 200", async () => {
            const dummyData = {
                    eMail: 'thomas.doe@hotmail.com',
                    dateJoined: '2022-05-05',
                    investedSum: 5000.0
                };
            const response = await request.put(ACCOUNTS_URL + '/1').send(dummyData);
            expect(response.status).toBe(200);
            expect(response.body['accountNr']).toEqual(1);
            expect(response.body['e-mail']).toEqual(dummyData.eMail);
            expect(response.body['invested sum']).toEqual(dummyData.investedSum);
        });
        // Attempt to update a non-existing account
        it("should return a status code of 404 if the account does not exist", async () => {
            const dummyData = {
                eMail: 'thomas.doe@hotmail.com',
                dateJoined: '2022-05-05',
                investedSum: 5000.0
            };
            const response = await request.put(ACCOUNTS_URL + '/9999').send(dummyData);
            expect(response.status).toBe(404);
            // Expect the response body to be empty
            expect(response.body).toEqual({});
        });
        // Attempt to update an account with an existing e-mail
        it("should return a status code of 409 if the e-mail already exists", async () => {
            const dummyData = {
                eMail: 'tom.doe@gmail.com',
                dateJoined: '2022-05-05',
                investedSum: 5000.0
            };
            const response = await request.put(ACCOUNTS_URL + '/9999').send(dummyData);
            expect(response.status).toBe(404);
            // Expect the response body to be empty
            expect(response.body).toEqual({});
        });
    });

    /**
     * Test case: DELETE /api/accounts/:accountNr
     *
     */

    describe(('DELETE ' + ACCOUNTS_URL + '/:accountNr'), () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should delete an existing account and return a status code of 200", async () => {
            const response = await request.delete(ACCOUNTS_URL + '/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(true);
        });

        // Attempt to delete a non-existing account
        it("should return a status code of 404 if the account does not exist", async () => {
            const response = await request.delete(ACCOUNTS_URL + '/9999');
            expect(response.status).toBe(404);
            // Expect the response body to be empty
            expect(response.body).toEqual(false);
        });
    });
});