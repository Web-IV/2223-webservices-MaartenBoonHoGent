const { withServer, DATA } = require('../helpers');
const { tables } = require('../../src/data');

describe('Withdraws', () => {
    let request;
    let knex;
    let authHeader;

    withServer(({ knex: k, request: r, authHeader: a }) => {
        knex = k;
        request = r;
        authHeader = a;
    });

    const WITHDRAWS_URL = `/api/withdraws`;

    describe('GET ' + WITHDRAWS_URL, () => {
        it("should return a status code of 200 and a list of withdraws", async () => {
            const response = await request.get(WITHDRAWS_URL).set("Authorization", authHeader);
            expect(response.body['count']).toEqual(DATA.withdraws.length);
            accountNrs = response.body['items'].map(withdraw => withdraw.account.accountNr);
            expect(accountNrs).toEqual(DATA.withdraws.map(withdraw => withdraw.accountNr));
            sums = response.body['items'].map(withdraw => withdraw.sum);
            expect(sums).toEqual(DATA.withdraws.map(withdraw => withdraw.sum));
        });
    });

    /**
     * Test case: GET /api/withdraws/:accountNr/:date
     */
    describe('GET ' + WITHDRAWS_URL + '/:accountNr/:date', () => {

        // Return positive status code
        it("should return a status code of 200 and a withdraw object", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(200);
            expect(response.body.account.accountNr).toStrictEqual(withdraw["accountNr"]);
            expect(response.body.sum).toStrictEqual(withdraw["sum"]);
        });
        // Return false status code on wrong date
        it("should return a status code of 404 and an error message", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date'] + 1}`).set("Authorization", authHeader);;
            expect(response.status).toBe(404);
        });
        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an error message", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(WITHDRAWS_URL + `/${withdraw['accountNr'] + 1}/${withdraw['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.get(WITHDRAWS_URL + `/${withdraw['accountNr']}/invalidDate`).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: POST /api/withdraws
    */
    describe('POST ' + WITHDRAWS_URL, () => {
        // Return positive status code
        it("should return a status code of 201 and a withdraw object", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000) + 5000;
            const response = await request.post(WITHDRAWS_URL).send(withdraw).set("Authorization", authHeader);;
            expect(response.status).toBe(201);
            expect(response.body.account.accountNr).toStrictEqual(withdraw["accountNr"]);
            expect(response.body.sum).toStrictEqual(withdraw["sum"]);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            withdraw['accountNr'] = 8000000000;
            const response = await request.post(WITHDRAWS_URL).send(withdraw).set("Authorization", authHeader);;
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = "invalidDate";
            const response = await request.post(WITHDRAWS_URL).send(withdraw).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: PUT /api/withdraws/:accountNr/:date
     * */
    describe('PUT ' + WITHDRAWS_URL + '/:accountNr/:date', () => {
        // Return positive status code
        it("should return a status code of 200 and a withdraw object", async () => {
            // Copy the first withdraw
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[2]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.put(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).send({ sum: (withdraw.sum * 2) }).set("Authorization", authHeader);;
            expect(response.status).toBe(200);
            expect(response.body.account.accountNr).toBe(withdraw.accountNr);
            expect(response.body.sum).toBe(withdraw.sum * 2);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404 and an empty body", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            withdraw['accountNr'] = 6000;
            const response = await request.put(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).send({ sum: withdraw.sum }).set("Authorization", authHeader);;
            expect(response.status).toBe(404);

        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = "invalidDate";
            const response = await request.put(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).send({ sum: withdraw.sum }).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });

    /**
     * Test case: DELETE /api/withdraws/:accountNr/:date
     * */
    describe('DELETE ' + WITHDRAWS_URL + '/:accountNr/:date', () => {

        // Return positive status code
        it("should return a status code of 204", async () => {
            // Copy the first withdraw
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[2]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            const response = await request.delete(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(204);
        });

        // Return false status code on wrong accountNr
        it("should return a status code of 404", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = Math.floor(new Date(withdraw['date']).getTime() / 1000);
            withdraw['accountNr'] = 6000;
            const response = await request.delete(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(404);
        });
        // Return false status code on invalid date
        it("should return a status code of 400", async () => {
            let withdraw = JSON.parse(JSON.stringify(DATA.withdraws[0]));
            // Change the date to a timestamp in seconds
            withdraw['date'] = "invalidDate";
            const response = await request.delete(WITHDRAWS_URL + `/${withdraw['accountNr']}/${withdraw['date']}`).set("Authorization", authHeader);;
            expect(response.status).toBe(400);
        });
    });
});