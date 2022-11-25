const { tables } = require('..');

/*

SQL statement to create the table
CREATE TABLE `Stock` (
  `stockId` bigint unsigned NOT NULL,
  `symbol` varchar(5) NOT NULL,
  `name` varchar(60) NOT NULL,
  `industry` varchar(60) DEFAULT NULL,
  `sector` varchar(60) DEFAULT NULL,
  `IPO date` date DEFAULT NULL,
  `date of incorporation` date DEFAULT NULL,
  PRIMARY KEY (`stockId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SELECT * FROM WebServices_Taak.Stock;

*/

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.stock, (table) => {
            table.increments('stockId').unsigned().notNullable();
            table.string('symbol', 5).notNullable();
            table.string('name', 60).notNullable();
            table.string('industry', 60).defaultTo(null);
            table.string('sector', 60).defaultTo(null);
            table.primary(['stockId']);
        });
    },
    
    down: async (knex) => {
        await knex.schema.dropTable(tables.stock);
    }
}