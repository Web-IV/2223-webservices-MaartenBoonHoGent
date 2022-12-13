const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

/**
 * 
 * @returns {Promise<Array>} An array of stocks
 */
const findAll = async () => {
    return getKnex()(tables.stock).select().orderBy('stockId');
}

/**
 * Gets the stock with the given id
 * @param {*} stockId 
 * @returns The stock
 * @returns undefined if the stock does not exist
 * @throws Error if the stock could not be retrieved
 */
const findById = async (stockId) => {
    try {
        return await getKnex()(tables.stock).select().where('stockId', stockId).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Gets the stock with the given symbol
 * @param {*} symbol 
 * @returns The stock
 * @returns undefined if the stock does not exist
 * @throws Error if the stock could not be retrieved
 */
const findBySymbol = async (symbol) => {
    try {
        return await getKnex()(tables.stock).select().where('symbol', symbol).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Creates a new stock
 * @param {*} Contains the following elements: symbol, name, industry, sector
 * @returns {Promise<Object>} The stockId of the stock
 * @throws Error if the stock could not be created
 */
const create = async ({symbol, name, industry, sector}) => {
    try {
        await getKnex()(tables.stock).insert(
            {'symbol': symbol, 
            'name': name, 
            'industry': industry, 
            'sector': sector});
        // Get the stockId of the newly created stock
        const stock = await findBySymbol(symbol);
        return stock.stockId;

    } catch (err) {
        const logger = getLogger();
        logger.error(`Error creating stock with values ${JSON.stringify(stock)}`, err);
        throw err;
    }
};

/**
 * Updates the stock with the given id
 * @param {*} stockId
 * @param {*} Contains the following elements: symbol, name, industry, sector
 * @returns {Promise<Object>} The stockId of the stock
 * @throws Error if the stock could not be updated
*/
const update = async (stockId, {symbol, name, industry, sector}) => {
    try {
        await getKnex()(tables.stock).where('stockId', stockId).update(
            {'symbol': symbol, 
            'name': name, 
            'industry': industry, 
            'sector': sector});
        // Get the stockId of the updated stock
        return stockId;
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating stock with key ${stockId}`, err);
        throw err;
    }
}

/**
 * Deletes the stock with the given id
 * @param {*} stockId 
 * @returns Nothing
 * @throws Error if the stock could not be deleted
 */
const deleteById = async (stockId) => {
    try {
        await getKnex()(tables.stock).where('stockId', stockId).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting stock with key ${stockId}`, err);
        throw err;
    }
}

module.exports = {
    findAll,
    findById,
    findBySymbol,
    create,
    update,
    deleteById
}

