let STOCKS = [
    {
        stockId: 1, 
        symbol: 'AAPL', 
        name: 'Apple Inc.', 
        industry: 'Technology', 
        sector: 'Consumer Electronics', 
        'IPO date': '1980-12-12', 
        'date of incorporation': '1976-04-01'
    },
    {
        stockId: 2,
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        industry: 'Technology',
        sector: 'Software',
        'IPO date': '1986-03-13',
        'date of incorporation': '1975-04-04'
    },
    {
        stockId: 3,
        symbol: 'AMZN',
        name: 'Amazon.com, Inc.',
        industry: 'Technology',
        sector: 'Internet',
        'IPO date': '1997-05-15',
        'date of incorporation': '1994-07-05'
    },
]

let ACCOUNTS = [
    {
        accountNr: 1,
        'e-mail': 'john.doe@gmail.com',
        'date joined': '2022-07-01',
        'invested sum': 1000.00,
        'password': '1234',
    },
    {
        accountNr: 2,
        'e-mail': 'jane.doe@gmail.com',
        'date joined': '2022-08-01',
        'invested sum': 1000.00,
        'password': '4567',
    },
]

let DEPOSITS = [
    {
        date : '2022-07-01',
        accountNr: 1,
        sum: 3000.00,
    },
    {
        date : '2022-08-01',
        accountNr: 2,
        sum: 2000.00,
    },
]

let WITHDRAWALS = [
    {
        date : '2022-08-01',
        accountNr: 1,
        sum: 2000.00,
    },
    {
        date : '2022-09-01',
        accountNr: 2,
        sum: 1000.00,
    },
]

let TRADES = [
    {
        tradeId: 1,
        stockId: 1,
        "price bought": 100.00,
        "price sold": 101.00,
        "date bought": '2022-08-01',
        "date sold": '2022-08-02',
        amount: 10,
    },
    {
        tradeId: 2,
        stockId: 2,
        "price bought": 200.00,
        "price sold": 201.00,
        "date bought": '2022-08-02',
        "date sold": '2022-08-03',
        amount: 10,
    },
    {
        tradeId: 3,
        stockId: 1,
        "price bought": 102.00,
        "price sold": 100.00,
        "date bought": '2022-08-03',
        "date sold": '2022-08-04',
        amount: 10,
    },


]