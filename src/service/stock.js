const stockRepo = require("../repository/stock");
const { getLogger } = require('../core/logging');

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

/**
 * Returns all stocks
 * @returns {Promise<Array>} An array of stocks
 */
const getAll = async () => {
    debugLog('Fetching all stocks');
    const items = await stockRepo.findAll();
    const count = items.length;
    return {
      items,
      count,
    };
}

/**
 * Returns the stock with the given id
 * @param {*} stockId 
 * @returns Stock if it exists
 * @returns null if the stock does not exist
 */
const getById = async (stockId) => {
    debugLog(`Fetching stock with id ${stockId}`);
    const stock = await stockRepo.findById(stockId);

    if (!stock) { return null; }
    return stock;
}

/**
 * Returns the stock with the given e-mail
 * @param {*} email
 * @returns Stock if it exists
 * @returns null if the stock does not exist
 */
const getBySymbol = async (symbol) => {
    debugLog(`Fetching stock with symbol ${symbol}`);
    const stock = await stockRepo.findBySymbol(symbol);

    if (!stock) { return null; }
    return stock;
}

/**
 * Updates a stock
 * @param {*} updateById
 * @param {*} Object with following properties: symbol, name, industry, sector
 * @returns The updated stock
 */
const updateById = async (stockId, { symbol, name, industry, sector }) => {
    debugLog(`Updating stock with id ${stockId}, new values: ${JSON.stringify({symbol, name, industry, sector})}`);
    await stockRepo.update(stockId, { symbol, name, industry, sector});
    return getById(stockId);
}

/**
 * Deletes a stock
 * @param {*} stockId 
 * @returns true if the stock was deleted
 * @returns false if the stock does not exist
 */
const deleteById = async (stockId) => {
    debugLog(`Deleting stock with id ${stockId}`);
    const stock = await stockRepo.findById(stockId);
    if (!stock) { return false; }
    else {
        try
        {
            await stockRepo.deleteById(stockId);
            return true;
        }
        catch (err) {
            return false;
        }
    }
}

/**
 * Creates a new stock
 * @param {*} Object  with following properties: symbol, name, industry, sector
 * @returns teh created stock
 * @returns null if the stock already exists
 */
const create = async ({ symbol, name, industry, sector}) => {
    debugLog(`Creating stock with values ${JSON.stringify({ symbol, name, industry, sector})}`);
    // Get the current stock
    const stock = await stockRepo.findBySymbol(symbol);
    if (stock) {
        // The stock already exists
        return null;
    }
    else {
        try {
            const id = await stockRepo.create({ symbol, name, industry, sector});
            return getById(id);
        }
        catch (err) {
            return null;
        }
    }
}

module.exports = {
	getAll,
	getById,
    getBySymbol,
	create,
	updateById,
	deleteById,
}
