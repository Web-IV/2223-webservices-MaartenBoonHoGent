const { tables, getIndex} = require('../data/index');
const { getLogger } = require('../core/logging');


const findAll = async () => {
    return getKnex(tables.TRADES).select().orderBy('tradeId');
}

const findCount = async () => {
    return await getKnex(tables.TRADES).count('*');
}


const findById = async (tradeId) => {
    return await getKnex(tables.TRADES).select().where('tradeId', tradeId).first();
}

const create = async ({stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
    return await getKnex(tables.TRADES).insert(
        {'stockId': stockId,
        'price bought': priceBought,
        'price sold': priceSold,
        'date bought': dateBought,
        'date sold': dateSold,
        'amount': amount});
};

const update = async (tradeId, {stockId, priceBought, priceSold, dateBought, dateSold, amount}) => {
    try {
        await getKnex(tables.TRADES).where('tradeId', tradeId).update(
            {'stockId': stockId,
            'price bought': priceBought,
            'price sold': priceSold,
            'date bought': dateBought,
            'date sold': dateSold,
            'amount': amount});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating trade with key ${tradeId}`, err);
        throw err;
    }
};

const deleteById = async (tradeId) => {
    try {
        await getKnex(tables.TRADES).where('tradeId', tradeId).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting trade with key ${tradeId}`, err);
        throw err;
    }
}

module.exports = {
    findAll,
    findCount,
    findById,
    create,
    update,
    deleteById
}
