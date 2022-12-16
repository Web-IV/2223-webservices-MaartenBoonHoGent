const { tables } = require('../../src/data');
const { withServer } = require('../helpers');

describe('stocks', () => {
    let request;
    let knex;

    withServer(({ knex: k, request: r }) => {
        knex = k;
        request = r;
    });
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

    /**
     * Test case: GET /api/stocks
     */
    describe("GET " + STOCKS_URL, () => {
        beforeAll(async () => {
        // Delete all data from the database
            await knex(tables.stock).delete();
            await knex(tables.stock).insert(DATA.stocks);      
        });

        afterAll(async () => {
            await knex(tables.stock).delete();
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
        // Delete all data from the database
            await knex(tables.stock).delete();
            await knex(tables.stock).insert(DATA.stocks);      
        });

        afterAll(async () => {
            await knex(tables.stock).delete();
        });
        // Test case: GET /api/stocks/1
        it("should return a stock with a status code of 200", async () => {
            const response = await request.get(STOCKS_URL + "/1");
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(DATA.stocks[0]);
        });

        // Test case: GET /api/stocks/4 (not found)
        it("should return a status code of 500", async () => {
            const response = await request.get(STOCKS_URL + "/4");
            expect(response.status).toBe(500);

        });
    });

    /**
     * Test case: GET /api/stocks/symbol/:symbol
    */
    describe("GET " + STOCKS_URL + "/symbol/:symbol", () => {
        beforeAll(async () => {
            // Delete all data from the database
            await knex(tables.stock).delete();
            await knex(tables.stock).insert(DATA.stocks);      
        });

        afterAll(async () => {
            await knex(tables.stock).delete();
        });
        // Test case: GET /api/stocks/symbol/AAPL
        it("should return a stock with a status code of 200", async () => {
            const response = await request.get(STOCKS_URL + "/symbol/AAPL");
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(DATA.stocks[0]);
        });

        // Test case: GET /api/stocks/symbol/NOTEXISTS (not found)
        it("should return a status code of 500", async () => {
            const response = await request.get(STOCKS_URL + "/symbol/NOTEXISTS");
            expect(response.status).toBe(500);

        });
    });

    /**
     * Test case: POST /api/stocks
    */
    describe("POST " + STOCKS_URL, () => {
        beforeAll(async () => {
        // Delete all data from the database
            await knex(tables.stock).delete();
            await knex(tables.stock).insert(DATA.stocks);      
        });

        afterAll(async () => {
            await knex(tables.stock).delete();
        });

        // Test case: POST /api/stocks
        it("should return a stock with a status code of 200", async () => {
            const stock = {symbol: 'TSLA', name: 'Tesla Inc.', 
            industry: 'Technology', sector: 'Consumer Electronics'};
            const response = await request.post(STOCKS_URL).send(stock);
            expect(response.status).toBe(200);
        });

        // Test case: POST /api/stocks (invalid stock)
        it("should return a status code of 400", async () => {
            const stock = {symbol: 'TSLA', name: 'Tesla Inc.', 
            industry: 'Technology'};
            const response = await request.post(STOCKS_URL).send(stock);
            expect(response.status).toBe(400);

        });

        // Test case: POST /api/stocks (duplicate stock)
        it("should return a status code of 409", async () => {
            const stock = {symbol: 'AAPL', name: 'Apple Inc.', 
            industry: 'Technology', sector: 'Consumer Electronics'};
            const response = await request.post(STOCKS_URL).send(stock);
            expect(response.status).toBe(409);

        });
    });

    /**
     * Test case: PUT /api/stocks/:stockId
    */
    describe("PUT " + STOCKS_URL + "/:stockId", () => {
        beforeAll(async () => {
        // Delete all data from the database
            await knex(tables.stock).delete();
            await knex(tables.stock).insert(DATA.stocks);      
        });

        afterAll(async () => {
            await knex(tables.stock).delete();
        });

        // Test case: PUT /api/stocks/1
        it("should return a stock with a status code of 200", async () => {
            const stock = {symbol: 'TSLA', name: 'Tesla Inc.', 
            industry: 'Technology', sector: 'Consumer Electronics'};
            const response = await request.put(STOCKS_URL + "/1").send(stock);
            expect(response.status).toBe(200);
        });

        // Test case: PUT /api/stocks/4 (not found)
        it("should return a status code of 500", async () => {
            const stock = {symbol: 'TSLA', name: 'Tesla Inc.', 
            industry: 'Technology', sector: 'Consumer Electronics'};
            const response = await request.put(STOCKS_URL + "/4").send(stock);
            expect(response.status).toBe(500);

        });

        // Test case: PUT /api/stocks/1 (invalid stock)
        it("should return a status code of 400", async () => {
            const stock = {symbol: 'TSLA', name: 'Tesla Inc.', 
            industry: 'Technology'};
            const response = await request.put(STOCKS_URL + "/1").send(stock);
            expect(response.status).toBe(400);

        });
    });

    /**
     * Test case: DELETE /api/stocks/:stockId
    */
    describe("DELETE " + STOCKS_URL + "/:stockId", () => {
        beforeAll(async () => {
        // Delete all data from the database
            await knex(tables.stock).delete();
            await knex(tables.stock).insert(DATA.stocks);      
        });

        afterAll(async () => {
            await knex(tables.stock).delete();
        });

        // Test case: DELETE /api/stocks/1
        it("should return a status code of 204 and true", async () => {
            const response = await request.delete(STOCKS_URL + "/1");
            expect(response.status).toBe(200);
            expect(response.body).toBe(true);
        });

        // Test case: DELETE /api/stocks/4 (not found)
        it("should return a status code of 404", async () => {
            const response = await request.delete(STOCKS_URL + "/50");
            expect(response.status).toBe(404);
        });
    });
    
});