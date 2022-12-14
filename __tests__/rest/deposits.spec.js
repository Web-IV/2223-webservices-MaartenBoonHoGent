const supertest = require('supertest');
const { getKnex, tables } = require('../../src/data');
const createServer = require('../../src/createServer');

describe("deposits", () => {
    let server;
    let request;
    let knex;

    // Constants
    const DEPOSITS_URL = "/api/deposits";
    const DATA = {
        accounts: [
            {accountNr: 1, 'e-mail': 'tom.doe@gmail.com', 'date joined': '2022-01-01 20:00:00', 'invested sum': 0.0},
            {accountNr: 2, 'e-mail': 'pip.doe@gmail.com', 'date joined': '2022-02-01 18:00:00', 'invested sum': 5000.0},
            {accountNr: 3, 'e-mail': 'sophie.doe@gmail.com', 'date joined': '2022-03-01 10:00:00', 'invested sum': 10000.0}],
        deposits: [
            {date: '2022-02-01 20:00:00', accountNr: 1, sum: 2000.00},
            {date : '2022-07-01 20:00:00', accountNr: 2, sum: 5000.00},
            {date : '2022-08-01 08:00:00', accountNr: 3, sum: 15000.00},
            {date : '2022-09-01 05:00:00', accountNr: 3, sum: 10000.00},

        ]
    };

    /** 
     * BeforeAll function
     */
    beforeAll(async () => {
        server = await createServer(); // create the server
        request = supertest(server.getApp().callback()); // Perform a supertest request
        knex = getKnex(); // get the knex instance. The server has to be created first

        // Delete all data from the database
        await knex(tables.account).delete();
        await knex(tables.deposit).delete();
        await knex(tables.account).insert(DATA.accounts);
        await knex(tables.deposit).insert(DATA.deposits);
    }
    );

    /**
     * AfterAll function
     */
    afterAll(async () => {
        // Delete all data from the database
        await knex(tables.account).delete();
        await knex(tables.deposit).delete();
        await server.stop(); // stop the server
    });

    // Test cases
    /**
     * Test case: GET /api/deposits
     */
    describe('GET ' + DEPOSITS_URL, () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a status code of 200 and a list of deposits", async () => {
            const response = await request.get(DEPOSITS_URL);
            expect(response.body['count']).toEqual(DATA.deposits.length);
            accountNrs = response.body['items'].map(deposit => deposit.accountNr);
            expect(accountNrs).toEqual(DATA.deposits.map(deposit => deposit.accountNr));
            sums = response.body['items'].map(deposit => deposit.sum);
            expect(sums).toEqual(DATA.deposits.map(deposit => deposit.sum));
        });
    });

    /**
     * Test case: GET /api/deposits/:accountNr/:date
     */
    describe('GET ' + DEPOSITS_URL + '/:accountNr/:date', () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        // Return positive status code
        it("should return a status code of 200 and a deposit object", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`);
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(deposit);
        });
        // Return false status code on wrong date
        it("should return a status code of 404 and an error message", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date'] + 1}`);
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toStrictEqual({});
        });
        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an error message", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr'] + 1}/${deposit['date']}`);
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toStrictEqual({});
        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr']}/invalidDate`);
            expect(response.status).toBe(400);
            // expect(response.body).toStrictEqual({error: "Invalid date"});
        });
    });

    /**
     * Test case: POST /api/deposits
    */
    describe('POST ' + DEPOSITS_URL, () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        // Return positive status code
        it("should return a status code of 201 and a deposit object", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000) + 5000;
            const response = await request.post(DEPOSITS_URL).send(deposit);
            expect(response.status).toBe(201);
            expect(response.body).toStrictEqual(deposit);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            deposit['accountNr'] = 8000000000;
            const response = await request.post(DEPOSITS_URL).send(deposit);
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toStrictEqual({});
        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = "invalidDate";
            const response = await request.post(DEPOSITS_URL).send(deposit);
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: PUT /api/deposits/:accountNr/:date
     * */
    describe('PUT ' + DEPOSITS_URL + '/:accountNr/:date', () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        // Return positive status code
        it("should return a status code of 200 and a deposit object", async () => {
            // Copy the first deposit
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.put(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).send({sum: deposit.sum});
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(deposit);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            deposit['accountNr'] = 6000;
            const response = await request.put(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).send({sum: deposit.sum});
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toStrictEqual({});
        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = "invalidDate";
            const response = await request.put(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).send({sum: deposit.sum});
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: DELETE /api/deposits/:accountNr/:date
     * */
    describe('DELETE ' + DEPOSITS_URL + '/:accountNr/:date', () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        // Return positive status code
        it("should return a status code of 200 and a deposit object", async () => {
            // Copy the first deposit
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.delete(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`);
            expect(response.status).toBe(200);
            expect(response.body).toBe(true);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            deposit['accountNr'] = 6000;
            const response = await request.delete(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`);
            expect(response.status).toBe(404);
            expect(response.body).toBe(false);
        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));  
            // Change the date to a timestamp in seconds
            deposit['date'] = "invalidDate";
            const response = await request.delete(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`);
            expect(response.status).toBe(400);
        });
    });
});