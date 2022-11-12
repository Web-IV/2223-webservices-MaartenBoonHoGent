const { TRADES }  = require('../data/mock_data');

const getAll = async () => {
    return { items: TRADES, count: TRADES.length };
}

const getById = async (id) => {
    throw new Error('Not implemented');
}

const updateById = async (tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
    throw new Error('Not implemented');
}

const deleteById = async (tradeId) => {
    throw new Error('Not implemented');
}

const create = async ({stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
    const id = TRADES.length + 1;
    const trade = { id, stockId, priceBought, priceSold, dateBought, dateSold, amount };
    
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
