const { tables } = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.account, (table) => {
            table.increments('accountNr').unsigned().notNullable();
            table.string('e-mail', 60).notNullable();
            table.timestamp('date joined').notNullable();
            table.bigInteger('invested sum').unsigned().notNullable().defaultTo(0);
            table.primary(['accountNr']);
            table.unique(['e-mail']);
            table.unique(['accountNr']);
        });
    },

    down: async (knex) => {
        await knex.schema.dropTable(tables.account);
    }
}
