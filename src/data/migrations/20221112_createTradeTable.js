const { tables } = require('..');

/*

SQL statement to create the table

CREATE TABLE `Trade` (
  `tradeId` int NOT NULL,
  `stockId` bigint unsigned NOT NULL,
  `price bought` float unsigned NOT NULL,
  `price sold` float unsigned NOT NULL,
  `date bought` timestamp NOT NULL,
  `date sold` timestamp NOT NULL,
  `amount` float unsigned NOT NULL,
  PRIMARY KEY (`tradeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


*/

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.trade, (table) => {
            table.integer('tradeId').notNullable();
            table.bigInteger('stockId').unsigned().notNullable();
            table.float('price bought').unsigned().notNullable();
            table.float('price sold').unsigned().notNullable();
            table.timestamp('date bought').notNullable();
            table.timestamp('date sold').notNullable();
            table.float('amount').unsigned().notNullable();
            table.primary(['tradeId']);
        });
    },

    down: async (knex) => {
        await knex.schema.dropTable(tables.trade);
    }
}
