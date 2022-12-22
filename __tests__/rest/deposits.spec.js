const { withServer, DATA } = require('../helpers');
const { tables } = require('../../src/data');

describe('Deposits', () => {
    let request;
    let knex;
    let authHeader;

    withServer(({ knex: k, request: r, authHeader: a }) => {
        knex = k;
        request = r;
        authHeader = a;
    });

    const DEPOSITS_URL = `/api/deposits`;

    describe('GET ' + DEPOSITS_URL, () => {
        it("should return a status code of 200 and a list of deposits", async () => {
            const response = await request.get(DEPOSITS_URL).set("Authorization", authHeader);
            expect(response.body['count']).toEqual(DATA.deposits.length);
            accountNrs = response.body['items'].map(deposit => deposit.account.accountNr);
            expect(accountNrs).toEqual(DATA.deposits.map(deposit => deposit.accountNr));
            sums = response.body['items'].map(deposit => deposit.sum);
            expect(sums).toEqual(DATA.deposits.map(deposit => deposit.sum));
        });
    });

    /**
     * Test case: GET /api/deposits/:accountNr/:date
     */
    describe('GET ' + DEPOSITS_URL + '/:accountNr/:date', () => {

        // Return positive status code
        it("should return a status code of 200 and a deposit object", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(200);
            expect(response.body.account.accountNr).toStrictEqual(deposit["accountNr"]);
            expect(response.body.sum).toStrictEqual(deposit["sum"]);
        });
        // Return false status code on wrong date
        it("should return a status code of 404 and an error message", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date'] + 1}`).set("Authorization", authHeader);;
            expect(response.status).toBe(404);
        });
        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an error message", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr'] + 1}/${deposit['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.get(DEPOSITS_URL + `/${deposit['accountNr']}/invalidDate`).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: POST /api/deposits
    */
    describe('POST ' + DEPOSITS_URL, () => {
        // Return positive status code
        it("should return a status code of 201 and a deposit object", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000) + 5000;
            const response = await request.post(DEPOSITS_URL).send(deposit).set("Authorization", authHeader);;
            expect(response.status).toBe(201);
            expect(response.body.account.accountNr).toStrictEqual(deposit["accountNr"]);
            expect(response.body.sum).toStrictEqual(deposit["sum"]);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            deposit['accountNr'] = 8000000000;
            const response = await request.post(DEPOSITS_URL).send(deposit).set("Authorization", authHeader);;
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = "invalidDate";
            const response = await request.post(DEPOSITS_URL).send(deposit).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: PUT /api/deposits/:accountNr/:date
     * */
    describe('PUT ' + DEPOSITS_URL + '/:accountNr/:date', () => {
        // Return positive status code
        it("should return a status code of 200 and a deposit object", async () => {
            // Copy the first deposit
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[2]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.put(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).send({ sum: (deposit.sum * 2) }).set("Authorization", authHeader);;
            expect(response.status).toBe(200);
            expect(response.body.account.accountNr).toBe(deposit.accountNr);
            expect(response.body.sum).toBe(deposit.sum * 2);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            deposit['accountNr'] = 6000;
            const response = await request.put(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).send({ sum: deposit.sum }).set("Authorization", authHeader);;
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = "invalidDate";
            const response = await request.put(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).send({ sum: deposit.sum }).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: DELETE /api/deposits/:accountNr/:date
     * */
    describe('DELETE ' + DEPOSITS_URL + '/:accountNr/:date', () => {

        // Return positive status code
        it("should return a status code of 204", async () => {
            // Copy the first deposit
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[2]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            const response = await request.delete(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(204);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = Math.floor(new Date(deposit['date']).getTime() / 1000);
            deposit['accountNr'] = 6000;
            const response = await request.delete(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(404);
        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let deposit = JSON.parse(JSON.stringify(DATA.deposits[0]));
            // Change the date to a timestamp in seconds
            deposit['date'] = "invalidDate";
            const response = await request.delete(DEPOSITS_URL + `/${deposit['accountNr']}/${deposit['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });
});