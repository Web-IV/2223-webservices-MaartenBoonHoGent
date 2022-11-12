const { WITHDRAWS } = require('../constants');

const getAll = () => {
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

const getById = (id) => {
    throw new Error('Not implemented');
}

const updateById = (id, { date, accountNr, sum}) => {
    throw new Error('Not implemented');
}

const deleteById = (id) => {
    throw new Error('Not implemented');
}

const create = ({ date, accountNr, sum}) => {
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
