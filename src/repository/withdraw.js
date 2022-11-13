const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = async () => {
    return await getKnex()(tables.withdraw).select();
}

const findById = async ({date, accountNr}) => {
    return await getKnex()(tables.withdraw).select().where({'date': date,
    'accountNr': accountNr}).first();
}

const create = async ({date, accountNr, sum}) => {
    try {
        await getKnex()(tables.withdraw).insert({'date': date, 'accountNr': accountNr,'sum': sum});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error creating withdraw with values ${JSON.stringify(withdraw)}`, err);
        throw err;
    }
}

const update = async ({date, accountNr}, {sum}) => {
    try {
        await getKnex()(tables.withdraw).where({'date': date, 'accountNr': accountNr}).update({'sum': sum});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating withdraw with key ${date} and ${accountNr}`, err);
        throw err;
    }
}

const deleteById = async ({date, accountNr}) => {
    try {
        await getKnex()(tables.withdraw).where({'date': date, 'accountNr': accountNr}).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting withdraw with key ${date} and ${accountNr}`, err);
        throw err;
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteById
}

