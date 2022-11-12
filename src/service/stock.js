let { STOCKS } = require('../data/mock_data');

const getAll = async () => {
    return { items: STOCKS, count: STOCKS.length };
}

const getById = async (id) => {
    throw new Error('Not implemented');
}

const updateById = async (id, { symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
    throw new Error('Not implemented');
}

const deleteById = async (id) => {
    throw new Error('Not implemented');
}

const create = async ({ symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
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
