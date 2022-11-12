const { tables, getIndex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = () => {
    return getKnex(tables.STOCKS).select().orderBy('stockId');
}

const findById = (stockId) => {
    // Not implemented
}

const findBySymbol = (symbol) => {
    // Not implemented
}

const create = (stock) => {
    // Not implemented
}

const update = (stock) => {
    // Not implemented
}

const deleteById = (stockId) => {
    // Not implemented
}

module.exports = {
    findAll,
    findById,
    findBySymbol,
    create,
    update,
    deleteById
}

