let { DEPOSITS } = require('../data/mock_data');

const getAll = async () => {
    return { items: DEPOSITS, count: DEPOSITS.length };
}

const getById = async (id) => {
    throw new Error('Not implemented');
}


const updateById = async (id, { date, accountNr, sum}) => {
    throw new Error('Not implemented');
}

const deleteById = async (id) => {
    throw new Error('Not implemented');
}

const create = async ({ date, accountNr, sum}) => {
    const id = DEPOSITS.length + 1;
    const deposit = { id, date, accountNr, sum };
    
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
