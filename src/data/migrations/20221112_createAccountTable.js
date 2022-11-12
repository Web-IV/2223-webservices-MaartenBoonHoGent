const { tables } = require('..');

/*

SQL statement to create the table
CREATE TABLE `Account` (
  `accountNr` int unsigned NOT NULL AUTO_INCREMENT,
  `e-mail` varchar(60) NOT NULL,
  `date joined` timestamp NOT NULL,
  `invested sum` bigint unsigned NOT NULL DEFAULT '0',
  `password` varchar(120) NOT NULL,
  PRIMARY KEY (`accountNr`),
  UNIQUE KEY `e-mail_UNIQUE` (`e-mail`),
  UNIQUE KEY `accountNr_UNIQUE` (`accountNr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

*/

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.account, (table) => {
            table.integer('accountNr').unsigned().notNullable().autoIncrement();
            table.string('e-mail', 60).notNullable();
            table.timestamp('date joined').notNullable();
            table.bigInteger('invested sum').unsigned().notNullable().defaultTo(0);
            table.string('password', 120).notNullable();
            table.primary(['accountNr']);
            table.unique(['e-mail']);
            table.unique(['accountNr']);
        });
    },

    down: async (knex) => {
        await knex.schema.dropTable(tables.account);
    }
}
