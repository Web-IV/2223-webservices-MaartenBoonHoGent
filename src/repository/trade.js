const { tables, getIndex} = require('../data/index');
const { getLogger } = require('../core/logging');


const findAll = () => {
    return getKnex(tables.TRADES).select().orderBy('tradeId');
}

const findById = (tradeId) => {
    // Not implemented
}

const findByStockId = (stockId) => {
    // Not implemented
}

const create = (trade) => {
    // Not implemented
}

const update = (trade) => {
    // Not implemented
}

const deleteById = (tradeId) => {
    // Not implemented
}

module.exports = {
    findAll,
    findById,
    findByStockId,
    create,
    update,
    deleteById
}
