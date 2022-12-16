const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

/**
 * Gets all withdraws
 * @returns {Promise<Array>} Array of withdraws
 */
const findAll = async () => {
    return getKnex()(tables.withdraw).select().join(tables.account, tables.account + '.accountNr', '=', tables.withdraw + '.accountNr');
}

/**
 * 
 * @param {*} Key with date and accountNr 
 * @returns Withdraw with the given key
 * @returns undefined if the withdraw does not exist
 * @throws Error if the withdraw could not be retrieved
 * 
 */
const findById = async ({date, accountNr}) => {
    try {  
        // Join the withdraw table with the account table
        return getKnex()(tables.withdraw).select()
        .join(tables.account, tables.account + '.accountNr', '=', tables.withdraw + '.accountNr')
        .where(tables.withdraw + ".accountNr", "=", accountNr, tables.withdraw + ".date", "=", date).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Creates a new withdraw
 * @param {Object} withdraw has date, accountNr and sum
 * 
 */
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


/**
 * Updates a withdraw
 * @param {*} key with date and accountNr 
 * @param {*} sum
 * @returns {Promise<Object>} Nothing
 * @throws Error if the withdraw could not be updated
 */
const update = async ({date, accountNr}, {sum}) => {
    try {
        await getKnex()(tables.withdraw).where({'date': date, 'accountNr': accountNr}).update({'sum': sum});
        // Get the withdraw with the given key
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating withdraw with key ${date} and ${accountNr}`, err);
        throw err;
    }
}

/**
 * deletes a withdraw
 * @param {*} key with date and accountNr 
 * @returns {Promise<Object>} Nothing
 * @throws Error if the withdraw could not be deleted
 */
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

