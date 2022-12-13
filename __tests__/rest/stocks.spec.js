const supertest = require('supertest');
const { getKnex, tables } = require('../../src/data');
const createServer = require('../../src/createServer');
const { response } = require('express');

describe('stocks', () => {
    let server;
    let request;
    let knex;

    // Constants
    const DATA = {
        stocks: [{stockId: 1, symbol: 'AAPL', name: 'Apple Inc.', 
        industry: 'Technology', sector: 'Consumer Electronics'},

        {stockId: 2, symbol: 'MSFT', name: 'Microsoft Corporation',
        industry: 'Technology', sector: 'Software'},

        {stockId: 3, symbol: 'AMZN', name: 'Amazon.com, Inc.',
        industry: 'Technology', sector: 'Internet'}]
    }
    const STOCKS_URL = "/api/stocks"

    beforeAll(async () => {
        server = await createServer(); // create the server
        request = supertest(server.getApp().callback()); // Perform a supertest request
        knex = getKnex(); // get the knex instance. The server has to be created first

        // Delete all data from the database
        await knex(tables.stock).delete();
        await knex(tables.stock).insert(DATA.stocks);
    }
    );

    /**
     * AfterAll function
     */
    afterAll(async () => {
        // Delete all data from the database
        await knex(tables.stock).delete();
        await server.stop(); // stop the server
    });

    /**
     * Test case: GET /api/stocks
     */
    describe("GET " + STOCKS_URL, () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a list of stocks and a status code of 200", async () => {
            const response = await request.get(STOCKS_URL);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(DATA.stocks.length);
            expect(response.body.items).toStrictEqual(DATA.stocks);
        });
    });

    /**
     * Test case: GET /api/stocks/:stockId
    */
    describe("GET " + STOCKS_URL + "/:stockId", () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a stock with a status code of 200", async () => {
            const response = await request.get(STOCKS_URL + "/1");
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(DATA.stocks[0]);
        });

        it("should return a status code of 404", async () => {
            const response = await request.get(STOCKS_URL + "/4");
            expect(response.status).toBe(404);
        });
    });
});