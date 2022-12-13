const supertest = require('supertest');
const { getKnex, tables } = require('../../src/data');
const createServer = require('../../src/createServer');

describe('trades', () => {
    let server;
    let request;
    let knex;

    // Constants
    const TRADES_URL = '/api/trades';
    const DATA = {
        trades: [{tradeId: 1, stockId: 1, 
            "price bought": 100.00, "price sold": 101.00, 
            "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'},

        {tradeId: 2, stockId: 2,
            "price bought": 200.00, "price sold": 201.00,
            "date bought": '2022-08-02', "date sold": '2022-08-03', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'},
        
        {tradeId: 3, stockId: 1,
            "price bought": 102.00, "price sold": 100.00,
            "date bought": '2022-08-03', "date sold": '2022-08-04', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'}],
        stocks: [{stockId: 1, symbol: 'AAPL', name: 'Apple Inc.', 
        industry: 'Technology', sector: 'Consumer Electronics'},

        {stockId: 2, symbol: 'MSFT', name: 'Microsoft Corporation',
        industry: 'Technology', sector: 'Software'},

        {stockId: 3, symbol: 'AMZN', name: 'Amazon.com, Inc.',
        industry: 'Technology', sector: 'Internet'}],
    };
    
    beforeAll(async () => {
        server = await createServer(); // create the server
        request = supertest(server.getApp().callback()); // Perform a supertest request
        knex = getKnex(); // get the knex instance. The server has to be created first

        // Delete all data from the database
        await knex(tables.trade).delete();
        await knex(tables.stock).delete();
        await knex(tables.trade).insert(DATA.trades);
        await knex(tables.stock).insert(DATA.stocks);
    }
    );

    /**
     * AfterAll function
     */
    afterAll(async () => {
        // Delete all data from the database
        await knex(tables.trade).delete();
        await knex(tables.stock).delete();
        await server.stop(); // stop the server
    });

    // Test cases
    
    /**
     * Test case: GET /api/trades
     */
    describe("GET " + TRADES_URL, () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a list of trades and a status code of 200", async () => {
            const response = await request.get(TRADES_URL);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(DATA.trades.length);
            tradeIds = response.body.items.map((trade) => trade.tradeId);
            expect(tradeIds).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade.tradeId)));
            stockIds = response.body.items.map((trade) => trade.stockId);
            expect(stockIds).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade.stockId)));
            pricesBought = response.body.items.map((trade) => trade["price bought"]);
            expect(pricesBought).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade["price bought"])));
            pricesSold = response.body.items.map((trade) => trade["price sold"]);
            expect(pricesSold).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade["price sold"])));
            amounts = response.body.items.map((trade) => trade.amount);
            expect(amounts).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade.amount)));
            commentsBought = response.body.items.map((trade) => trade["comment bought"]);
            expect(commentsBought).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade["comment bought"])));
            commentsSold = response.body.items.map((trade) => trade["comment sold"]);
            expect(commentsSold).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade["comment sold"])));
        });
    });

    /**
     * Test case: GET /api/trades/:tradeId
    */
    describe("GET " + TRADES_URL + "/:tradeId", () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a trade with the given tradeId and a status code of 200", async () => {
            const tradeId = 1;
            const response = await request.get(TRADES_URL + "/" + tradeId);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(tradeId);
            expect(response.body.stockId).toBe(DATA.trades[0].stockId);
            expect(response.body["price bought"]).toBe(DATA.trades[0]["price bought"]);
            expect(response.body["price sold"]).toBe(DATA.trades[0]["price sold"]);
            expect(response.body.amount).toBe(DATA.trades[0].amount);
            expect(response.body["comment bought"]).toBe(DATA.trades[0]["comment bought"]);
            expect(response.body["comment sold"]).toBe(DATA.trades[0]["comment sold"]);
        });
        // Test case: GET /api/trades/:tradeId with an invalid tradeId
        it("should return a status code of 404", async () => {
            const tradeId = 100;
            const response = await request.get(TRADES_URL + "/" + tradeId);
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toEqual({});
        });
    });

    /**
     * Test case: POST /api/trades
    */
    describe("POST " + TRADES_URL, () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a status code of 201", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 50, "comment bought": 'bought 50 shares', "comment sold": 'sold 50 shares'
            };
            const response = await request.post(TRADES_URL).send(trade);
            expect(response.status).toBe(201);
            // expect(response.body.tradeId).toBe(4);
            expect(response.body.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });
        // Test case: POST /api/trades with an invalid stockId
        it("should return a status code of 404 when receiving an invalid stockId", async () => {
            const trade = {
                stockId: 100,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade);
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toEqual({});
        });
        // Test case: POST /api/trades with an invalid price bought
        it("should return a status code of 400 when receiving an invalid price sold", async () => {
            const trade = {
                stockId: 2,
                "price bought": -1, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade);
            expect(response.status).toBe(400);
            // Body should be empty
            expect(response.body).toEqual({});
        });
        // Test case: POST /api/trades with an invalid price sold
        it("should return a status code of 400 when receiving an invalid price sold", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": -1,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade);
            expect(response.status).toBe(400);
            // Body should be empty
            expect(response.body).toEqual({});
        });
        // Test case: POST /api/trades with an invalid amount
        it("should return a status code of 400 when receiving an invalid amount", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: -1, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade);
            expect(response.status).toBe(400);
            // Body should be empty
            expect(response.body).toEqual({});
        });
        // Test case: POST /api/trades with an empty comment bought
        it("should return a status code of 201 when receiving an empty comment bought", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": '', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade);
            expect(response.status).toBe(201);
            // expect(response.body.tradeId).toBe(4);
            expect(response.body.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });
        // Test case: POST /api/trades with an empty comment sold
        it("should return a status code of 201 when receiving an empty comment sold", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": ''
            };
            const response = await request.post(TRADES_URL).send(trade);
            expect(response.status).toBe(201);
            // expect(response.body.tradeId).toBe(4);
            expect(response.body.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });
    });

    /**
     * Test cases for PUT /api/trades/:tradeId
     */

    describe("PUT " + TRADES_URL + "/:tradeId", () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        // Test case: PUT /api/trades/:tradeId with a valid tradeId
        it("should return a status code of 200 when receiving a valid tradeId", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(1);
            expect(response.body.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });
        // Test case: PUT /api/trades/:tradeId with an invalid tradeId
        it("should return a status code of 404 when receiving an invalid tradeId", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/100").send(trade);
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toEqual({});
        });
        // Test case: PUT /api/trades/:tradeId with an invalid stockId
        it("should return a status code of 404 when receiving an invalid stockId", async () => {
            const trade = {
                stockId: 100,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade);
            expect(response.status).toBe(404);
            // Body should be empty
            expect(response.body).toEqual({});
        });
        // Test case: PUT /api/trades/:tradeId with an invalid price bought
        it("should return a status code of 400 when receiving an invalid price bought", async () => {
            const trade = {
                stockId: 1,
                "price bought": -100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade);
            expect(response.status).toBe(400);
            // Body should be empty
            expect(response.body).toEqual({});
        });

        // Test case: PUT /api/trades/:tradeId with an invalid price sold
        it("should return a status code of 400 when receiving an invalid price sold", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": -101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade);
            expect(response.status).toBe(400);
            // Body should be empty
            expect(response.body).toEqual({});
        });

        // Test case: PUT /api/trades/:tradeId with an invalid amount
        it("should return a status code of 400 when receiving an invalid amount", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: -10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade);
            expect(response.status).toBe(400);
            // Body should be empty
            expect(response.body).toEqual({});
        });

        // Test case: PUT /api/trades/:tradeId with an empty comment bought
        it("should return a status code of 200 when receiving an empty comment bought", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": '', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(1);
            expect(response.body.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });


        // Test case: PUT /api/trades/:tradeId with an empty comment sold
        it("should return a status code of 200 when receiving an empty comment sold", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10, "comment bought": 'bought 10 shares', "comment sold": ''
            };
            const response = await request.put(TRADES_URL + "/1").send(trade);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(1);
            expect(response.body.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });
    });

    /**
     * Test cases for DELETE /api/trades/:tradeId
     */
    describe("DELETE" + TRADES_URL + "/:tradeId", () => {
        beforeAll(async () => {
            await beforeAll;
        });

        afterAll(async () => {
            await afterAll;
        });

        it("should return a status code of 200 and true if the trade was deleted", async() => {
            const response = await request.delete(TRADES_URL + "/1");
            expect(response.status).toBe(200);
            expect(response.body).toBe(true);
        });
        // Test case: DELETE /api/trades/:tradeId with an invalid number
        it("should return a status code of 404 and false if the trade couldn't be deleted", async() => {
            const response = await request.delete(TRADES_URL + "/999999999");
            expect(response.status).toBe(404);
            expect(response.body).toBe(false);
        });
    }
    );
});