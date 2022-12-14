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
            {accountNr: 1, 'e-mail': 'tom.doe@gmail.com', 'date joined': '2022-01-01', 'invested sum': 0.0},
            {accountNr: 2, 'e-mail': 'pip.doe@gmail.com', 'date joined': '2022-02-01', 'invested sum': 5000.0},
            {accountNr: 3, 'e-mail': 'sophie.doe@gmail.com', 'date joined': '2022-03-01', 'invested sum': 10000.0}],
        deposits: [
            {date: '2022-02-01', accountNr: 1, sum: 2000.00},
            {date : '2022-07-01', accountNr: 2, sum: 5000.00},
            {date : '2022-08-01', accountNr: 3, sum: 15000.00},
            {date : '2022-09-01', accountNr: 3, sum: 10000.00},

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
            let deposit = DATA.deposits[0];
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`);
            console.log(response.body, );
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(deposit);
        });
        // Return false status code on wrong date
        // Return false status code on invalid date
        // Return false status code on wrong accountNr
    });
});