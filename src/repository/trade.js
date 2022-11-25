const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

/**
 * Get all trades
 * @returns  {Promise<Array>}  Array of trades
 */
const findAll = async () => {
    return getKnex()(tables.trade).select().orderBy('tradeId');
}

/**
 * Returns a trade by its id
 * @param {*} tradeId 
 * @returns {Promise<Object>} Trade
 * @returns undefined if the trade does not exist
 * @throws {Error} If something goes wrong
 * 
 */
const findById = async (tradeId) => {
    try
    {
        const trade = await getKnex()(tables.trade).where('tradeId', tradeId).first();
        return trade;
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }

}

/**
 * Creates a new trade
 * @param {*} Object containing the following elements: stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold
 * @returns The tradeId of the newly created trade
 * @throws Error if the trade could not be created
 */
const create = async ({stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold}) => {
    try {
        return await getKnex()(tables.trade).insert(
            {'stockId': stockId,
            'price bought': priceBought,
            'price sold': priceSold,
            'date bought': dateBought,
            'date sold': dateSold,
            'amount': amount,
            'comment bought': commentBought,
            'comment sold': commentSold}).returning('tradeId');
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
};

/**
 * Updates a trade
 * @param {*} tradeId 
 * @param {*} Object containing the following elements: stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold 
 * @returns {Promise<Object>} The updated tradeId
 */
const update = async (tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold}) => {
    try {
        await getKnex()(tables.trade).where('tradeId', tradeId).update(
            {'stockId': stockId,
            'price bought': priceBought,
            'price sold': priceSold,
            'date bought': dateBought,
            'date sold': dateSold,
            'amount': amount, 
            'comment bought': commentBought, 
            'comment sold': commentSold});
        return tradeId;
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating trade with key ${tradeId}`, err);
        throw err;
    }
};

/**
 * Deletes a trade
 * @param {*} tradeId 
 * @returns nothing
 * @throws Error if the trade could not be deleted
 */
const deleteById = async (tradeId) => {
    try {
        await getKnex()(tables.trade).where('tradeId', tradeId).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting trade with key ${tradeId}`, err);
        throw err;
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteById
}
