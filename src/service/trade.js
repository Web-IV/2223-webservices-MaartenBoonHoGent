const { TRADES }  = require('../data/mock_data');

const getAll = () => {
    return { items: TRADES, count: TRADES.length };
}

const getById = (id) => {
    throw new Error('Not implemented');
}

const updateById = (tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
    throw new Error('Not implemented');
}

const deleteById = (tradeId) => {
    throw new Error('Not implemented');
}

const create = ({stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
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
