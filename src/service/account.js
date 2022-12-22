const accountRepo = require("../repository/account");
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');

// Account exists of the following elements: accountNr, e-mail, date joined, invested sum

const formatOutgoingAccount = (account) => {
    if (!account) throw ServiceError.notFound('Account does not exist');
    if (account === undefined) throw ServiceError.notFound('Account does not exist');
    return {
        accountNr: account.accountNr,
        ["e-mail"]: account["e-mail"],
        ["date joined"]: Math.floor(new Date(account["date joined"]).getTime() / 1000),
        ["invested sum"]: account["invested sum"],
    };
}

const formatIncomingAccount = (account) => {
    if (!account) return null;
    if (account === undefined) return null;
    return {
        eMail: account.eMail,
        dateJoined: new Date(account.dateJoined * 1000),
        investedSum: account.investedSum,
    };
}

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};
  
/**
 * Returns all accounts
 * @returns {Promise<Array>} An array of accounts
 */
const getAll = async () => {
    debugLog('Fetching all accounts');
    let items = await accountRepo.findAll();
    items = items.map(formatOutgoingAccount);
    const count = items.length;
    return {
      items,
      count,
    };
};

/**
 * Gets 1 account from the database
 * @param {*} id 
 * @returns the account if it exists
 * @returns null if the account does not exist
 */
const getById = async (id) => {
    debugLog(`Fetching account with id ${id}`);
    const account = await accountRepo.findById(id);
    return formatOutgoingAccount(account);
}

/**
 * 
 * @param {*} eMail : the e-mail of the account 
 * @returns The account if it exists
 * @returns null if the account does not exist
 */
const getByEmail = async (eMail) => {
    debugLog(`Fetching account with eMail ${eMail}`);
    const account = await accountRepo.findByEmail(eMail);
    return formatOutgoingAccount(account);
};

/**
 * Updates an account
 * @param {*} accountNr 
 * @param {*} param: existing accountNr, e-mail, date joined, invested sum
 * @returns the updated account
 * @returns null if the account does not exist
 */
const updateById = async (accountNr, { eMail, dateJoined, investedSum}) => {
    debugLog(`Updating account with id ${accountNr}, new values: ${JSON.stringify({eMail, dateJoined, investedSum})}`);
    
    // Find the account
    const account = await accountRepo.findById(accountNr);
    if (!account) { throw ServiceError.notFound(`account with accountNr ${accountNr} doesn't exist.`); }
    const getAccountByEmail = await accountRepo.findByEmail(eMail);
    if (getAccountByEmail && getAccountByEmail.accountNr !== accountNr) { throw ServiceError.conflict(`account with eMail ${eMail} already exists.`); }
    await accountRepo.update(accountNr, formatIncomingAccount({eMail, dateJoined, investedSum}))
    return getById(accountNr);
}

/**
 * Deletes an account
 * @param {*} accountNr 
 * @returns true if the account was deleted
 * @returns false if the account does not exist
 */
const deleteById = async (accountNr) => {
    debugLog(`Deleting account with id ${accountNr}`);
    const account = await accountRepo.findById(accountNr);
    if (!account) { throw ServiceError.notFound(`account with accountNr ${accountNr} doesn't exist.`) }
    else {
        try {
            await accountRepo.deleteById(accountNr);
        }
        catch (err) {
            throw ServiceError.internalServerError('Could not delete account');
        }
    }
}

/**
 * Creates an account
 * @param {*} exists of the following elements: e-mail, date joined, invested sum 
 * @returns the created account
 * @returns null if the account already exists 
*/
const create = async ({eMail, dateJoined, investedSum}) => {
    const account = {eMail, dateJoined, investedSum };
    debugLog(`Creating new account with values: ${JSON.stringify(account)}`);
    // Check if the account already exists
    const existingAccount = await accountRepo.findByEmail(eMail);
    if (existingAccount) {
        // Throw error
        throw ServiceError.conflict('Account already exists');
    }
    else {
        try {
            const accountNr = await accountRepo.create(formatIncomingAccount(account));
            return getById(accountNr);
        }
        catch (err) {
            // Log error
            const logger = getLogger();
            logger.error('Could not create account', err);
            throw ServiceError.internal('Could not create account');
        }
    }
}

module.exports = {
    getAll,
    getById,
    getByEmail,
    create,
    updateById,
    deleteById,
    formatOutgoingAccount,
}
