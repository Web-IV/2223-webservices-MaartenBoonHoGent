const { tables } = require("..");

module.exports = {
    seed: async (knex) => {
        // Delete
        await knex(tables.trade).delete();

        // Insert
        await knex(tables.trade).insert([
            {tradeId: 1, stockId: 1, 
                "price bought": 100.00, "price sold": 101.00, 
                "date bought": '2022-08-01T00:00:00Z', "date sold": '2022-08-02T00:00:00Z', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'},

            {tradeId: 2, stockId: 2,
                "price bought": 200.00, "price sold": 201.00,
                "date bought": '2022-08-02T00:00:00Z', "date soldT00:00:00Z": '2022-08-03', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'},
            
            {tradeId: 3, stockId: 1,
                "price bought": 102.00, "price sold": 100.00,
                "date bought": '2022-08-03', "date sold": '2022-08-04T00:00:00Z', amount: 10, "comment bought": 'bought 10 shares', "comment sold": 'sold 10 shares'},
        ]);
    }
}

