const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');
// Account exists of the following elements: accountNr, e-mail, date joined, invested sum

/**
 * Gets all accounts from the database
 * @returns {Promise<Array>} An array of accounts
 */
const findAll = async () => {
    return getKnex()(tables.account).select().orderBy('accountNr');
}

/**
 * Gets an account from the database
 * @param {string} accountNr The account number of the account
 * @returns {Promise<Object>} The account
 * @returns undefined if the account does not exist
 * @throws Error if the account could not be retrieved
*/
const findById = async (accountNr) => {
    try {
        return getKnex()(tables.account).select().where('accountNr', accountNr).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Gets the account with the given e-mail
 * @param {string} eMail The e-mail of the account
 * @returns {Promise<Object>} The account
 * @returns undefined if the account does not exist
 * @throws Error if the account could not be retrieved
 */
const findByEmail = async (email) => {
    try {
        return getKnex()(tables.account).select().where('e-mail', email).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * 
 * @param {*} contains the following elements: e-mail, date joined, invested sum
 * @returns {Promise<Object>} The accountNr of the account
 * @throws Error if the account could not be created
 */
const create = async ({eMail, dateJoined, investedSum}) => {
    try {
        await getKnex()(tables.account).insert({
            'e-mail': eMail, 
            'date joined': dateJoined, 
            'invested sum': investedSum});
        // Get the accountNr of the newly created account
        const account = await findByEmail(eMail);
        return account.accountNr;
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error creating account with values ${JSON.stringify({eMail, dateJoined, investedSum})}`, err);
        throw err;
    }
}

/**
 * 
 * @param {*} accountNr 
 * @param {*} dict contains the following elements: e-mail, date joined, invested sum
 * @returns {Promise<Object>} The e-mail of the account
 * @throws Error if the account could not be updated
 */
const update = async (accountNr, {eMail, dateJoined, investedSum}) => {
    try {
        await getKnex()(tables.account).where('accountNr', accountNr).update({
            'e-mail': eMail, 
            'date joined': dateJoined, 
            'invested sum': investedSum});
        // Return the updated accountNr
        return accountNr;
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating account with id ${accountNr}`, err);
        throw err;
    }
};

/**
 * Deletes an account from the database
 * @param {*} accountNr 
 * @returns Nothing
 * @throws Error if the account could not be deleted
 */
const deleteById = async (accountNr) => {
    try {
        await getKnex()(tables.account).where('accountNr', accountNr).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting account with id ${accountNr}`, err);
        throw err;
    }
};

module.exports = {
    findAll,
    findById,
    findByEmail,
    create,
    update,
    deleteById
}





