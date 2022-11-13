const { tables } = require("..");

module.exports = {
    seed: async (knex) => {
        // Delete
        await knex(tables.account).delete();

        // Insert
        await knex(tables.account).insert([
            {accountNr: 1, 'e-mail': 'john.doe@gmail.com', 'date joined': '2022-07-01', 'invested sum': 1000.00, 'password': '1234'},
            {accountNr: 2, 'e-mail': 'jane.doe@gmail.com', 'date joined': '2022-08-01', 'invested sum': 1000.00, 'password': '4567'}
        ]);
    }
}