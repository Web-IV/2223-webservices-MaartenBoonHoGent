const { tables, getIndex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = () => {
    return getKnex(tables.WITHDRAWS).select();
}

const findById = ([id1 , id2]) => {
    // Not implemented
}

const findByAccountId = (accountId) => {µ
    // Not implemented

}

const create = (withdraw) => {
    // Not implemented
}

const update = (withdraw) => {
    // Not implemented
}

const deleteById = ([id1 , id2]) => {
    // Not implemented
}

module.exports = {
    findAll,
    findById,
    findByAccountId,
    create,
    update,
    deleteById
}

