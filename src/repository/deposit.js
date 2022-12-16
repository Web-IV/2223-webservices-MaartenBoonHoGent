const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

/**
 * Gets all deposits
 * @returns {Promise<Array>} Array of deposits
 */
const findAll = async () => {
    return getKnex()(tables.deposit).select().join(tables.account, tables.account + '.accountNr', '=', tables.deposit + '.accountNr');
}

/**
 * 
 * @param {*} Key with date and accountNr 
 * @returns Deposit with the given key
 * @returns undefined if the deposit does not exist
 * @throws Error if the deposit could not be retrieved
 * 
 */
const findById = async ({date, accountNr}) => {
    try {  
        return getKnex()(tables.deposit).select()
        .join(tables.account, tables.account + '.accountNr', '=', tables.deposit + '.accountNr')
        .whereRaw(`${tables.deposit}.accountNr = ? AND ${tables.deposit}.date = ?`, [accountNr, date]).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Creates a new deposit
 * @param {Object} deposit has date, accountNr and sum
 * 
 */
const create = async ({date, accountNr, sum}) => {
    try {
        await getKnex()(tables.deposit).insert({'date': date, 'accountNr': accountNr,'sum': sum});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error creating deposit with values ${JSON.stringify(deposit)}`, err);
        throw err;
    }
}


/**
 * Updates a deposit
 * @param {*} key with date and accountNr 
 * @param {*} sum
 * @returns {Promise<Object>} Nothing
 * @throws Error if the deposit could not be updated
 */
const update = async ({date, accountNr}, {sum}) => {
    try {
        await getKnex()(tables.deposit).where({'date': date, 'accountNr': accountNr}).update({'sum': sum});
        // Get the deposit with the given key
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating deposit with key ${date} and ${accountNr}`, err);
        throw err;
    }
}

/**
 * deletes a deposit
 * @param {*} key with date and accountNr 
 * @returns {Promise<Object>} Nothing
 * @throws Error if the deposit could not be deleted
 */
const deleteById = async ({date, accountNr}) => {
    try {
        await getKnex()(tables.deposit).where({'date': date, 'accountNr': accountNr}).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting deposit with key ${date} and ${accountNr}`, err);
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

