const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = async () => {
    return getKnex(tables.DEPOSITS).select();
}

const findCount = async () => {
    return getKnex(tables.DEPOSITS).count('*');
}

const findById = async ({date, accountNr}) => {
    return getKnex(tables.DEPOSITS).select().where({'date': date, 
    'accountNr': accountNr}).first();
}

const create = async ({date, accountNr, sum}) => {
    try {
        await getKnex(tables.DEPOSITS).insert({'date': date, 'accountNr': accountNr,'sum': sum});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error creating deposit with values ${JSON.stringify(deposit)}`, err);
        throw err;
    }
}

const update = async ({date, accountNr}, {sum}) => {
    try {
        await getKnex(tables.DEPOSITS).where({'date': date, 'accountNr': accountNr}).update({'sum': sum});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating deposit with key ${date} and ${accountNr}`, err);
        throw err;
    }
}

const deleteById = async ({date, accountNr}) => {
    try {
        await getKnex(tables.DEPOSITS).where({'date': date, 'accountNr': accountNr}).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting deposit with key ${date} and ${accountNr}`, err);
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

