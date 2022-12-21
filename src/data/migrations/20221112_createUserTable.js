const { tables } = require("..");

// exists of name and auth0Ids

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.user, (table) => {
            table.increments("userId").unsigned().notNullable();
            table.string("name", 60).notNullable();
            table.string("auth0Id", 60).notNullable();
            table.primary(["userId"]);
        });
    },
    down: async (knex) => {
        return knex.schema.dropTableIfExists(tables.user);
    }
};