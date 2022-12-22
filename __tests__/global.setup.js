const config = require('config');
const DATABASE_NAME = config.get('database.name');
const { initializeData, getKnex, tables } = require('../src/data');
const { initializeLogger } = require('../src/core/logging');
const { DATA } = require('./helpers');

module.exports = async () => {
    initializeLogger({
        level: config.get('log.level'),
        disabled: config.get('log.disabled'),
    });

    // Create a database connection (needed to insert test data or cleanup after tests)
    await initializeData();
    // Remove the test database, this is so auto_increment values start at 1
    await getKnex().raw(`DROP DATABASE IF EXISTS ${DATABASE_NAME}`);
    // Restart
    await initializeData();
    // Insert test data
    await getKnex()(tables.account).insert(DATA.accounts);
    await getKnex()(tables.deposit).insert(DATA.deposits);
    await getKnex()(tables.withdraw).insert(DATA.withdraws);
    await getKnex()(tables.stock).insert(DATA.stocks);
    await getKnex()(tables.trade).insert(DATA.trades);
    
};
