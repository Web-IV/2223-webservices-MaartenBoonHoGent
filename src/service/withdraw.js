const { WITHDRAWS } = require('../constants');

const getAll = async () => {
    return { items: WITHDRAWS, count: WITHDRAWS.length };
}

/*
withdraw object:
    {
        date : '2022-09-01',
        accountNr: 2,
        sum: 1000.00,
    },
*/

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
    const id = WITHDRAWS.length + 1;
    const withdraw = { id, date, accountNr, sum };
    
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
