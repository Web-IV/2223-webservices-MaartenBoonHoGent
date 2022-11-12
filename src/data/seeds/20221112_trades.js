const { tables } = require("..");

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

module.exports = {
    seed: async (knex) => {
        // Delete
        await knex(tables.trade).delete();

        // Insert
        await knex(tables.trade).insert([
            {tradeId: 1, stockId: 1, 
                "price bought": 100.00, "price sold": 101.00, 
                "date bought": '2022-08-01', "date sold": '2022-08-02', amount: 10},

            {tradeId: 2, stockId: 2,
                "price bought": 200.00, "price sold": 201.00,
                "date bought": '2022-08-02', "date sold": '2022-08-03', amount: 10},
            
            {tradeId: 3, stockId: 1,
                "price bought": 102.00, "price sold": 100.00,
                "date bought": '2022-08-03', "date sold": '2022-08-04', amount: 10},
        ]);
    }
}

