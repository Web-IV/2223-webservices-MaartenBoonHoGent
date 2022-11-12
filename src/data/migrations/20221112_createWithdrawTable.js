const { tables } = require('..');

/*

SQL statement to create the table

CREATE TABLE `Withdraw` (
  `date` timestamp NOT NULL,
  `accountNr` bigint unsigned NOT NULL,
  `sum` bigint unsigned NOT NULL,
  PRIMARY KEY (`date`,`accountNr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

*/

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.withdraw, (table) => {
            table.timestamp('date').notNullable();
            table.bigInteger('accountNr').unsigned().notNullable();
            table.bigInteger('sum').unsigned().notNullable();
            table.primary(['date', 'accountNr']);
        });
    },

    down: async (knex) => {
        await knex.schema.dropTable(tables.withdraw);
    }
}