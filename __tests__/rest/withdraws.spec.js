const { tables } = require('../../src/data');
const { withServer } = require('../helpers');

describe("withdraws", () => {
    let request;
    let knex;

    withServer(({ knex: k, request: r }) => {
        knex = k;
        request = r;
    });
    // Constants
    const DEPOSITS_URL = "/api/withdraws";
    const DATA = {
        accounts: [
            {'e-mail': 'tom.doe@gmail.com', 'date joined': '2022-01-01 20:00:00', 'invested sum': 0.0},
            {'e-mail': 'pip.doe@gmail.com', 'date joined': '2022-02-01 18:00:00', 'invested sum': 5000.0},
            {'e-mail': 'sophie.doe@gmail.com', 'date joined': '2022-03-01 10:00:00', 'invested sum': 10000.0}],
        withdraws: [
            {date: '2022-02-01 20:00:00', accountNr: 1, sum: 2000.00},
            {date : '2022-07-01 20:00:00', accountNr: 2, sum: 5000.00},
            {date : '2022-08-01 08:00:00', accountNr: 3, sum: 15000.00},
            {date : '2022-09-01 05:00:00', accountNr: 3, sum: 10000.00},

        ]
    };

    // Test cases
    /**
     * Test case: GET /api/withdraws
     */
    describe('GET ' + DEPOSITS_URL, () => {
        beforeAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
            await knex(tables.account).insert(DATA.accounts);
            await knex(tables.withdraw).insert(DATA.withdraws);
        });

        afterAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
        });

        it("should return a status code of 200 and a list of withdraws", async () => {
            const response = await request.get(DEPOSITS_URL);
            expect(response.body['count']).toEqual(DATA.withdraws.length);
            accountNrs = response.body['items'].map(withdraw => withdraw.accountNr);
            expect(accountNrs).toEqual(DATA.withdraws.map(withdraw => withdraw.accountNr));
            sums = response.body['items'].map(withdraw => withdraw.sum);
            expect(sums).toEqual(DATA.withdraws.map(withdraw => withdraw.sum));
        });
    });

    /**
     * Test case: GET /api/withdraws/:accountNr/:date
     */
    describe('GET ' + DEPOSITS_URL + '/:accountNr/:date', () => {
        beforeAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
            await knex(tables.account).insert(DATA.accounts);
            await knex(tables.withdraw).insert(DATA.withdraws);
        });

        afterAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
        });

        // Return positive status code
        it("should return a status code of 200 and a withdraw object", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`);
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(withdraw);
        });
        // Return false status code on wrong date
        it("should return a status code of 404 and an error message", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date'] + 1}`);
            expect(response.status).toBe(404);
        });
        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an error message", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${withdraw['accountNr'] + 1}/${withdraw['date']}`);
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${withdraw['accountNr']}/invalidDate`);
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: POST /api/withdraws
    */
    describe('POST ' + DEPOSITS_URL, () => {
        beforeAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
            await knex(tables.account).insert(DATA.accounts);
            await knex(tables.withdraw).insert(DATA.withdraws);
        });

        afterAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
        });

        // Return positive status code
        it("should return a status code of 200 and a withdraw object", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000) + 5000;
            const response = await request.post(DEPOSITS_URL).send(withdraw);
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(withdraw);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            withdraw['accountNr'] = 8000000000;
            const response = await request.post(DEPOSITS_URL).send(withdraw);
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = "invalidDate";
            const response = await request.post(DEPOSITS_URL).send(withdraw);
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: PUT /api/withdraws/:accountNr/:date
     * */
    describe('PUT ' + DEPOSITS_URL + '/:accountNr/:date', () => {
        beforeAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
            await knex(tables.account).insert(DATA.accounts);
            await knex(tables.withdraw).insert(DATA.withdraws);
        });

        afterAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
        });

        // Return positive status code
        it("should return a status code of 200 and a withdraw object", async () => {
            // Copy the first withdraw
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.put(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).send({sum: withdraw.sum});
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(withdraw);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            withdraw['accountNr'] = 6000;
            const response = await request.put(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).send({sum: withdraw.sum});
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = "invalidDate";
            const response = await request.put(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).send({sum: withdraw.sum});
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: DELETE /api/withdraws/:accountNr/:date
     * */
    describe('DELETE ' + DEPOSITS_URL + '/:accountNr/:date', () => {
        beforeAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
            await knex(tables.account).insert(DATA.accounts);
            await knex(tables.withdraw).insert(DATA.withdraws);
        });

        afterAll(async () => {
            await knex(tables.account).delete();
            await knex(tables.withdraw).delete();
        });

        // Return positive status code
        it("should return a status code of 200 and a withdraw object", async () => {
            // Copy the first withdraw
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.delete(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`);
            expect(response.status).toBe(200);
            expect(response.body).toBe(true);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            withdraw['accountNr'] = 6000;
            const response = await request.delete(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`);
            expect(response.status).toBe(404);
        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));  
            // Change the date to a timestamp in seconds
            withdraw['date'] = "invalidDate";
            const response = await request.delete(DEPOSITS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`);
            expect(response.status).toBe(400);
        });
    });
});