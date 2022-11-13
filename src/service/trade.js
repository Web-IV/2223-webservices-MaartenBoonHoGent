const stockRepo = require("../repository/stock");
const tradeRepo = require("../repository/trade");
const { getLogger } = require('../core/logging');


const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

const getAll = async () => {
    debugLog('Fetching all trades');
    const items = await tradeRepo.findAll();
    const count = items.length;
    return {
        items,
        count,
    };
}

const getById = async (tradeId) => {
    debugLog('Fetching trade by id', { tradeId });
    const trade = await tradeRepo.findById(tradeId);
    if (!trade) {
        throw new Error(`Trade with id ${tradeId} not found`);
    }
    return trade;
}

const updateById = async (tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
    debugLog('Updating trade by id', { tradeId });
    const trade = await tradeRepo.findById(tradeId);
    if (!trade) {
        throw new Error(`Trade with id ${tradeId} not found`);
    }

    // Check if the stock exists
    const stock = await stockRepo.findById(stockId);
    if (!stock) {
        throw new Error(`Stock with id ${stockId} not found`);
    }
    
    await tradeRepo.update(tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount});
    return getById(tradeId);
}

const deleteById = async (tradeId) => {
    debugLog('Deleting trade by id', { tradeId });
    const trade = await tradeRepo.findById(tradeId);
    if (!trade) {
        throw new Error(`Trade with id ${tradeId} not found`);
    }
    else {
        await tradeRepo.deleteById(tradeId);
    }
}

const create = async ({stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
    debugLog('Creating trade', { stockId, priceBought, priceSold, dateBought, dateSold, amount });
    // Check if the stock exists
    const stock = await stockRepo.findById(stockId);
    if (!stock) {
        throw new Error(`Stock with id ${stockId} not found`);
    }
    else {
        tradeRepo.create({stockId, priceBought, priceSold, dateBought, dateSold, amount});
    }
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
