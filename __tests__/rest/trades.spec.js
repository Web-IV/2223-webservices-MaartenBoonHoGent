const { withServer, DATA } = require('../helpers');

describe('Trades', () => {
    let request;
    let knex;
    let authHeader;

    withServer(({ knex: k, request: r, authHeader: a }) => {
        knex = k;
        request = r;
        authHeader = a;
    });

    const TRADES_URL = `/api/trades`;

    /**
     * Test case: GET /api/trades
     */
    describe("GET " + TRADES_URL, () => {
        it("should return a list of trades and a status code of 200", async () => {
            const response = await request.get(TRADES_URL).set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(DATA.trades.length);
            tradeIds = response.body.items.map((trade) => trade.tradeId);
            expect(tradeIds).toEqual(expect.arrayContaining(DATA.trades.map((trade) => trade.tradeId)));
            stockIds = response.body.items.map((trade) => trade.stock.stockId);
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
        it("should return a trade with the given tradeId and a status code of 200", async () => {
            const tradeId = DATA.trades[0].tradeId;
            const response = await request.get(TRADES_URL + "/" + tradeId).set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(tradeId);
            expect(response.body.stock.stockId).toBe(DATA.trades[0].stockId);
            expect(response.body["price bought"]).toBe(DATA.trades[0]["price bought"]);
            expect(response.body["price sold"]).toBe(DATA.trades[0]["price sold"]);
            expect(response.body.amount).toBe(DATA.trades[0].amount);
            expect(response.body["comment bought"]).toBe(DATA.trades[0]["comment bought"]);
            expect(response.body["comment sold"]).toBe(DATA.trades[0]["comment sold"]);
        });
        // Test case: GET /api/trades/:tradeId with an invalid tradeId
        it("should return a status code of 404", async () => {
            const tradeId = 999999;
            const response = await request.get(TRADES_URL + "/" + tradeId).set("Authorization", authHeader);
            expect(response.status).toBe(404);
        });
    });

    /**
     * Test case: POST /api/trades
    */
    describe("POST " + TRADES_URL, () => {
        it("should return a status code of 200", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1659304800, "date sold": 1659391200, amount: 50, "comment bought": 'bought 50 shares', "comment sold": 'sold 50 shares'
            };
            const response = await request.post(TRADES_URL).send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(201);
            // expect(response.body.tradeId).toBe(4);
            expect(response.body.stock.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });
        // Test case: POST /api/trades with an invalid stockId
        it("should return a status code of 404 when receiving an invalid stockId", async () => {
            const trade = {
                stockId: 9999,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(404);
        });
        // Test case: POST /api/trades with an invalid price bought
        it("should return a status code of 400 when receiving an invalid price sold", async () => {
            const trade = {
                stockId: 2,
                "price bought": -1, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(400);
        });
        // Test case: POST /api/trades with an invalid price sold
        it("should return a status code of 400 when receiving an invalid price sold", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": -1,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(400);

        });
        // Test case: POST /api/trades with an invalid amount
        it("should return a status code of 400 when receiving an invalid amount", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: -1, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(400);
        });
        // Test case: POST /api/trades with an empty comment bought
        it("should return a status code of 200 when receiving an empty comment bought", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": '', "comment sold": 'sold 10 shares'
            };
            const response = await request.post(TRADES_URL).send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(201);
            // expect(response.body.tradeId).toBe(4);
            expect(response.body.stock.stockId).toBe(trade.stockId);
            expect(response.body["price bought"]).toBe(trade["price bought"]);
            expect(response.body["price sold"]).toBe(trade["price sold"]);
            expect(response.body.amount).toBe(trade.amount);
            expect(response.body["comment bought"]).toBe(trade["comment bought"]);
            expect(response.body["comment sold"]).toBe(trade["comment sold"]);
        });
        // Test case: POST /api/trades with an empty comment sold
        it("should return a status code of 200 when receiving an empty comment sold", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": ''
            };
            const response = await request.post(TRADES_URL).send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(201);
            // expect(response.body.tradeId).toBe(4);
            expect(response.body.stock.stockId).toBe(trade.stockId);
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
        // Test case: PUT /api/trades/:tradeId with a valid tradeId
        it("should return a status code of 200 when receiving a valid tradeId", async () => {
            const trade = {
                stockId: 2,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/3").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(3);
            expect(response.body.stock.stockId).toBe(trade.stockId);
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
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/9999").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(404);
        });
        // Test case: PUT /api/trades/:tradeId with an invalid stockId
        it("should return a status code of 404 when receiving an invalid stockId", async () => {
            const trade = {
                stockId: 9999,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(404);

        });
        // Test case: PUT /api/trades/:tradeId with an invalid price bought
        it("should return a status code of 400 when receiving an invalid price bought", async () => {
            const trade = {
                stockId: 1,
                "price bought": -100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(400);
        });

        // Test case: PUT /api/trades/:tradeId with an invalid price sold
        it("should return a status code of 400 when receiving an invalid price sold", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": -101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(400);
        });

        // Test case: PUT /api/trades/:tradeId with an invalid amount
        it("should return a status code of 400 when receiving an invalid amount", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: -10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/1").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(400);
        });

        // Test case: PUT /api/trades/:tradeId with an empty comment bought
        it("should return a status code of 200 when receiving an empty comment bought", async () => {
            const trade = {
                stockId: 1,
                "price bought": 100.00, "price sold": 101.00,
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": '', "comment sold": 'sold 10 shares'
            };
            const response = await request.put(TRADES_URL + "/3").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(3);
            expect(response.body.stock.stockId).toBe(trade.stockId);
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
                "date bought": 1640991600, "date sold": 1641078000, amount: 10, "comment bought": 'bought 10 shares', "comment sold": ''
            };
            const response = await request.put(TRADES_URL + "/3").send(trade).set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body.tradeId).toBe(3);
            expect(response.body.stock.stockId).toBe(trade.stockId);
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
        it("should return a status code of 200 if the trade was deleted", async () => {
            const response = await request.delete(TRADES_URL + "/3").set("Authorization", authHeader);
            expect(response.status).toBe(204);
        });
        // Test case: DELETE /api/trades/:tradeId with an invalid number
        it("should return a status code of 404 if the trade couldn't be deleted", async () => {
            const response = await request.delete(TRADES_URL + "/999999999").set("Authorization", authHeader);
            expect(response.status).toBe(404);
        });
    });

});