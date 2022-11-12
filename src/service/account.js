let { ACCOUNTS } = require('../data/mock_data');

const getAll = async () => {
    return { items: ACCOUNTS, count: ACCOUNTS.length };
}

const getById = async (id) => {
    throw new Error('Not implemented');
}

// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

const updateById = async (id, { accountNr, eMail, dateJoined, investedSum, password}) => {
    throw new Error('Not implemented');
}

const deleteById = async (id) => {
    throw new Error('Not implemented');
}

const create = async ({ accountNr, eMail, dateJoined, investedSum, password}) => {
    const id = ACCOUNTS.length + 1;
    const account = { id, accountNr, eMail, dateJoined, investedSum, password };
    
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
