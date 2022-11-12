const { tables, getIndex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = () => {
    return getKnex(tables.ACCOUNTS).select().orderBy('accountId');
}

const findById = (accountId) => {
    // Not implemented
}

const findByEmail = (email) => {
    // Not implemented
}

const create = (account) => {
    // Not implemented
}

const update = (account) => {
    // Not implemented
}

const deleteById = (accountId) => {
    // Not implemented
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    create,
    update,
    deleteById
}





