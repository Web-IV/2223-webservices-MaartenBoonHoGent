let { DEPOSITS } = require('../data/mock_data');

const getAll = () => {
    return { items: DEPOSITS, count: DEPOSITS.length };
}

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
