const { withServer, DATA } = require('../helpers');

describe('Stocks', () => {
    let request;
    let knex;
    let authHeader;

    withServer(({ knex: k, request: r, authHeader: a }) => {
        knex = k;
        request = r;
        authHeader = a;
    });

    const STOCKS_URL = `/api/stocks`;
    /**
     * Test case: GET /api/stocks
     */
    describe("GET " + STOCKS_URL, () => {
        it("should return a list of stocks and a status code of 200", async () => {
            const response = await request.get(STOCKS_URL).set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(DATA.stocks.length);
            expect(response.body.items).toStrictEqual(DATA.stocks);
        });
    });

    /**
     * Test case: GET /api/stocks/:stockId
    */
    describe("GET " + STOCKS_URL + "/:stockId", () => {
        // Test case: GET /api/stocks/1
        it("should return a stock with a status code of 200", async () => {
            const response = await request.get(STOCKS_URL + "/1").set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(DATA.stocks[0]);
        });

        // Test case: GET /api/stocks/4 (not found)
        it("should return a status code of 404", async () => {
            const response = await request.get(STOCKS_URL + "/4").set("Authorization", authHeader);
            expect(response.status).toBe(404);

        });
    });

    /**
     * Test case: GET /api/stocks/symbol/:symbol
    */
    describe("GET " + STOCKS_URL + "/symbol/:symbol", () => {
        // Test case: GET /api/stocks/symbol/AAPL
        it("should return a stock with a status code of 200", async () => {
            const response = await request.get(STOCKS_URL + "/symbol/AAPL").set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body).toStrictEqual(DATA.stocks[0]);
        });

        // Test case: GET /api/stocks/symbol/NOTEXISTS (not found)
        it("should return a status code of 404", async () => {
            const response = await request.get(STOCKS_URL + "/symbol/NOTEXISTS").set("Authorization", authHeader);
            expect(response.status).toBe(404);

        });
    });

    /**
     * Test case: POST /api/stocks
    */
    describe("POST " + STOCKS_URL, () => {
        // Test case: POST /api/stocks
        it("should return a stock with a status code of 200", async () => {
            const stock = {
                symbol: 'TSLA', name: 'Tesla Inc.',
                industry: 'Technology', sector: 'Consumer Electronics'
            };
            const response = await request.post(STOCKS_URL).send(stock).set("Authorization", authHeader);
            expect(response.status).toBe(201);
        });

        // Test case: POST /api/stocks (invalid stock)
        it("should return a status code of 400", async () => {
            const stock = {
                symbol: 'TSLA', name: 'Tesla Inc.',
                industry: 'Technology'
            };
            const response = await request.post(STOCKS_URL).send(stock).set("Authorization", authHeader);
            expect(response.status).toBe(400);

        });

        // Test case: POST /api/stocks (duplicate stock)
        it("should return a status code of 409", async () => {
            const stock = {
                symbol: 'AAPL', name: 'Apple Inc.',
                industry: 'Technology', sector: 'Consumer Electronics'
            };
            const response = await request.post(STOCKS_URL).send(stock).set("Authorization", authHeader);
            expect(response.status).toBe(409);

        });
    });

    /**
     * Test case: PUT /api/stocks/:stockId
    */
    describe("PUT " + STOCKS_URL + "/:stockId", () => {
        // Test case: PUT /api/stocks/1
        it("should return a stock with a status code of 200", async () => {
            const stock = {
                symbol: 'AMZN', name: 'Amazon.com, Inc',
                industry: 'Technology', sector: 'Internet & Direct Marketing Retail'
            };
            const response = await request.put(STOCKS_URL + "/3").send(stock).set("Authorization", authHeader);
            expect(response.status).toBe(200);
        });

        // Test case: PUT /api/stocks/9999999 (not found)
        it("should return a status code of 404", async () => {
            const stock = {
                symbol: 'TSLA', name: 'Tesla Inc.',
                industry: 'Technology', sector: 'Consumer Electronics'
            };
            const response = await request.put(STOCKS_URL + "/999999999").send(stock).set("Authorization", authHeader);
            expect(response.status).toBe(404);

        });

        // Test case: PUT /api/stocks/1 (invalid stock)
        it("should return a status code of 400", async () => {
            const stock = {
                symbol: 'TSLA', name: 'Tesla Inc.',
                industry: 'Technology'
            };
            const response = await request.put(STOCKS_URL + "/1").send(stock).set("Authorization", authHeader);
            expect(response.status).toBe(400);

        });

        // ToDo: Test case: PUT /api/stocks/1 (duplicate symbol)
    });

    /**
     * Test case: DELETE /api/stocks/:stockId
    */
    describe("DELETE " + STOCKS_URL + "/:stockId", () => {
        // Test case: DELETE /api/stocks/1
        it("should return a status code of 204 and true", async () => {
            const response = await request.delete(STOCKS_URL + "/3").set("Authorization", authHeader);
            expect(response.status).toBe(204);
        });

        // Test case: DELETE /api/stocks/4 (not found)
        it("should return a status code of 404", async () => {
            const response = await request.delete(STOCKS_URL + "/50").set("Authorization", authHeader);
            expect(response.status).toBe(404);
        });
    });

});