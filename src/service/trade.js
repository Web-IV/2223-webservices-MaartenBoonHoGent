const stockRepo = require("../repository/stock");
const tradeRepo = require("../repository/trade");
const { getLogger } = require('../core/logging');


const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

/**
 * Returns all trades
 * @returns {Promise<Array>} Array of trades
 */
const getAll = async () => {
    debugLog('Fetching all trades');
    const items = await tradeRepo.findAll();
    const count = items.length;
    return {
        items,
        count,
    };
}

/**
 * Get a trade by its id
 * @param {*} tradeId 
 * @returns {Promise<Object>} Trade
 * @returns null if the trade does not exist
 */
const getById = async (tradeId) => {
    debugLog('Fetching trade by id', { tradeId });
    const trade = await tradeRepo.findById(tradeId);
    if (!trade) {
        return null;
    }
    return trade;
}

/**
 * Updates a trade
 * @param {*} tradeId
 * @param {*} trade object containing the following elements: stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold
 * @returns {Promise<Object>} The updated trade
 * @returns null if the trade or stock does not exist
 */
const updateById = async (tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold}) => {
    debugLog('Updating trade by id', { tradeId });
    const trade = await tradeRepo.findById(tradeId);
    if (!trade) {
        return null;
    }
    // Check if the stock exists
    const stock = await stockRepo.findById(stockId);
    if (!stock) {
        return null;
    }

    await tradeRepo.update(tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount});
    return getById(tradeId);
}

/**
 * Deletes a trade
 * @param {*} tradeId
 * @returns True if the trade was deleted, false if the trade does not exist 
 */
const deleteById = async (tradeId) => {
    debugLog('Deleting trade by id', { tradeId });
    const trade = await tradeRepo.findById(tradeId);
    if (!trade) {
        return false;
    }
    else {
        try {
            await tradeRepo.deleteById(tradeId);
            return true;
        }catch(err) {
            return false;
        }
    }
}

/**
 * Creates a new trade
 * @param {*} Object containing the following elements: stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold
 * @returns The tradeId of the newly created trade
 * @returns null if the stock does not exist
 * @throws Error if the trade could not be created
 */
const create = async ({stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold}) => {
    debugLog('Creating trade', { stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold });
    // Check if the stock exists
    const stockFound = await stockRepo.findById(stockId);
    if (!stockFound) {
        return null;
    }
    else {
        try {
            const tradeId = await tradeRepo.create({stockId, priceBought, priceSold, dateBought, dateSold, amount, commentBought, commentSold});
            console.log(tradeId);
            return await getById(tradeId);
        }
        catch (err) {
            return null;
        }
    }
}
module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
