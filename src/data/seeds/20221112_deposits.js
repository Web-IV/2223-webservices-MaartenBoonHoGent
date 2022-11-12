const { tables } = require("..");

module.exports = {
    seed: async (knex) => {
        // Delete
        await knex(tables.deposit).delete();

        // Insert
        await knex(tables.deposit).insert([
            {date : '2022-07-01', accountNr: 1, sum: 3000.00},
            {date : '2022-08-01', accountNr: 2, sum: 2000.00},

        ]);
    }
}