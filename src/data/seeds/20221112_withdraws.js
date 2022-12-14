const { tables } = require("..");

module.exports = {
    seed: async (knex) => {
        // Delete
        await knex(tables.withdraw).delete();

        // Insert
        await knex(tables.withdraw).insert([
            {date : '2022-08-01 00:00:00', accountNr: 1, sum: 2000.00},
            {date : '2022-09-01 00:00:00', accountNr: 2, sum: 1000.00},

        ]);
    }
}