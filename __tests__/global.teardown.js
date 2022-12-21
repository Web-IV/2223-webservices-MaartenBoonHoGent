const { shutdown, getKnex, tables } = require('../src/data');

module.exports = async () => {
    // Remove any leftover data
    await getKnex()(tables.stock).delete();

    await getKnex()(tables.deposit).delete();
    await getKnex()(tables.trade).delete();
    await getKnex()(tables.withdraw).delete();
    await getKnex()(tables.account).delete();
    await getKnex()(tables.user).delete();
    
    // Close database connection
    await shutdown();
};
