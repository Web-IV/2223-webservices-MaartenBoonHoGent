const axios = require('axios');
const config = require('config');
const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getKnex } = require('../src/data/');

const fetchAccessToken = async () => {
    const response = await axios.post(config.get('auth.tokenUrl'), {
        grant_type: 'password',
        username: config.get('auth.testUser.username'),
        password: config.get('auth.testUser.password'),
        audience: config.get('auth.audience'),
        scope: 'openid profile email offline_access',
        client_id: config.get('auth.clientId'),
        client_secret: config.get('auth.clientSecret'),
    }, {
        headers: { "Accept-Encoding": "gzip,deflate,compress" }
    });

    return response.data.access_token;
};

const withServer = (setter) => {
    let server;

    beforeAll(async () => {
        // Log the current hour, minute, second and millisecond
        server = await createServer();
        const token = await fetchAccessToken();

        setter({
            knex: getKnex(),
            request: supertest(server.getApp().callback()),
            authHeader: `Bearer ${token}`,
        });
    });

    afterAll(async () => {

        await server.stop();
    });
};

const DATA = {
    accounts: [
        { 'accountNr': 1, 'e-mail': 'tom.doe@gmail.com', 'date joined': new Date('2022-01-01 00:00:00'), 'invested sum': 10000.0 },
        { 'accountNr': 2, 'e-mail': 'pip.doe@gmail.com', 'date joined': new Date('2022-02-01 00:00:00'), 'invested sum': 5000.0 },
        { 'accountNr': 3, 'e-mail': 'sophie.doe@gmail.com', 'date joined': new Date('2022-03-01 00:00:00'), 'invested sum': 10000.0 } // The account to edit and delete
    ],
    deposits: [
        { date: new Date('2022-07-01 20:00:00'), accountNr: 1, sum: 5000.00 },
        { date: new Date('2022-08-01 08:00:00'), accountNr: 2, sum: 15000.00 },
        { date: new Date('2022-09-01 05:00:00'), accountNr: 2, sum: 10000.00 }, // The deposit to edit and delete
    ],
    withdraws: [
        { date: new Date('2022-05-28 15:00:00'), accountNr: 1, sum: 5000.00 },
        { date: new Date('2022-08-01 00:00:00'), accountNr: 2, sum: 15000.00 },
        { date: new Date('2022-08-14 01:00:00'), accountNr: 2, sum: 10000.00 }, // The withdraw to edit and delete
    ],
    stocks: [
        {
            stockId: 1, symbol: 'AAPL', name: 'Apple Inc.',
            industry: 'Technology', sector: 'Consumer Electronics'
        },

        {
            stockId: 2, symbol: 'MSFT', name: 'Microsoft Corporation',
            industry: 'Technology', sector: 'Software'
        },

        {
            stockId: 3, symbol: 'AMZN', name: 'Amazon.com, Inc.',
            industry: 'Technology', sector: 'Internet'
        } // The stock to edit and delete
    ],
    trades: [{tradeId: 1, stockId: 1, 
        "price bought": 100.00, "price sold": 101.00, 
        "date bought": new Date('2022-08-01 00:00:00'), "date sold": new Date('2022-08-02 00:00:00'), amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'},

    {tradeId: 2, stockId: 2,
        "price bought": 200.00, "price sold": 200.00,
        "date bought": new Date('2022-08-02 00:00:00'), "date sold": new Date('2022-08-03 00:00:00'), amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'},
    
    {tradeId: 3, stockId: 1,
        "price bought": 102.00, "price sold": 100.00,
        "date bought": new Date('2022-08-03 00:00:00'), "date sold": new Date('2022-08-04 00:00:00'), amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'}] // The trade to edit and delete
}

module.exports = {
    fetchAccessToken,
    withServer,
    DATA,
};