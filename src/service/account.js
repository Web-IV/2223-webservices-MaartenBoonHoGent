let { ACCOUNTS } = require('../data/mock_data');

const getAll = () => {
    return { items: ACCOUNTS, count: ACCOUNTS.length };
}

const getById = (id) => {
    throw new Error('Not implemented');
}

// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

const updateById = (id, { accountNr, eMail, dateJoined, investedSum, password}) => {
    throw new Error('Not implemented');
}

const deleteById = (id) => {
    throw new Error('Not implemented');
}

const create = ({ accountNr, eMail, dateJoined, investedSum, password}) => {
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
