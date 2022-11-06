let { STOCKS } = require('../data/mock_data');

const getAll = () => {
    return { items: STOCKS, count: STOCKS.length };
}

const getById = (id) => {
    throw new Error('Not implemented');
}

const updateById = (id, { symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
    throw new Error('Not implemented');
}

const deleteById = (id) => {
    throw new Error('Not implemented');
}

const create = ({ symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
    // Don't do this in production, this is just for demo purposes
    const id = STOCKS.length + 1;
    const stock = { id, symbol, name, industry, sector, IPODate, dateOfIncorporation };
    
}

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
}
