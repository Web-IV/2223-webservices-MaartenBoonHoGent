const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = async () => {
    return getKnex()(tables.stock).select().orderBy('stockId');
}

const findById = async (stockId) => {
    return await getKnex()(tables.stock).select().where('stockId', stockId).first();

}

const findBySymbol = async (symbol) => {
    return await getKnex()(tables.stock).select().where('symbol', symbol).first();
}

const create = async ({symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
    try {
        await getKnex()(tables.stock).insert(
            {'symbol': symbol, 
            'name': name, 
            'industry': industry, 
            'sector': sector, 
            'IPO date': IPODate, 
            'date of incorporation': dateOfIncorporation});
    } catch (err) {
        const logger = getLogger();
        logger.error(`Error creating stock with values ${JSON.stringify(stock)}`, err);
        throw err;
    }
};

const update = async (stockId, {symbol, name, industry, sector, IPODate, dateOfIncorporation}) => {
    
    try {
        await getKnex()(tables.stock).where('stockId', stockId).update(
            {'symbol': symbol, 
            'name': name, 
            'industry': industry, 
            'sector': sector, 
            'IPO date': IPODate, 
            'date of incorporation': dateOfIncorporation});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating stock with key ${stockId}`, err);
        throw err;
    }
}

const deleteById = async (stockId) => {
    try {
        await getKnex()(tables.stock).where('stockId', stockId).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting stock with key ${stockId}`, err);
        throw err;
    }
}

module.exports = {
    findAll,
    findById,
    findBySymbol,
    create,
    update,
    deleteById
}

