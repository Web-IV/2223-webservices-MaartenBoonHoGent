const stockRepo = require("../repository/stock");
const { getLogger } = require('../core/logging');

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};
const getAll = async () => {
    debugLog('Fetching all stocks');
    const items = await stockRepo.findAll();
    const count = items.length;
    return {
      items,
      count,
    };
}

const getById = async (stockId) => {
    debugLog(`Fetching stock with id ${stockId}`);
    const stock = await stockRepo.findById(stockId);

    if (!stock) { throw new Error(`Stock with id ${stockId} not found`); }
    return stock;
}

const getBySymbol = async (symbol) => {
    debugLog(`Fetching stock with symbol ${symbol}`);
    const stock = await stockRepo.findBySymbol(symbol);

    if (!stock) { throw new Error(`Stock with symbol ${symbol} not found`); }
    return stock;
}


const updateById = async (stockId, { symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
    debugLog(`Updating stock with id ${stockId}, new values: ${JSON.stringify({symbol, name, industry, sector, IPODate, dateOfIncorporation})}`);
    await stockRepo.update(stockId, { symbol, name, industry, sector, IPODate, dateOfIncorporation});
    return getById(stockId);
}

const deleteById = async (stockId) => {
    debugLog(`Deleting stock with id ${stockId}`);
    const stock = await stockRepo.findById(stockId);
    if (!stock) { throw new Error(`Stock with id ${stockId} not found`); }
    else {
        await stockRepo.deleteById(stockId);
    }
}

const create = async ({ symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
    debugLog(`Creating stock with values ${JSON.stringify({ symbol, name, industry, sector, IPODate, dateOfIncorporation})}`);
    
    // Get the current stock
    const stock = await stockRepo.findBySymbol(symbol);
    if (stock) {
        throw new Error(`Stock with symbol ${symbol} already exists`);
    }
    else {
        stockRepo.create({ symbol, name, industry, sector, IPODate, dateOfIncorporation});
    }
    return getBySymbol(symbol);
}

module.exports = {
	getAll,
	getById,
    getBySymbol,
	create,
	updateById,
	deleteById,
}
