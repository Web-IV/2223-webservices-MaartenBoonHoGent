const accountRepo = require("../repository/account");
const { getLogger } = require('../core/logging');

// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

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
    const items = await accountRepo.findAll();
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

    if (!account) {account = null;}
    return account;
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

    if (!account) {account = null;}
    return account;
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
    if (!account) { return null; }
    else {await accountRepo.update(accountNr, {eMail, dateJoined, investedSum});}
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
    if (!account) { return false; }
    else {await accountRepo.deleteById(accountNr);}
    return true;
}

/**
 * Creates an account
 * @param {*} exists of the following elements: e-mail, date joined, invested sum 
 */
const create = async ({eMail, dateJoined, investedSum}) => {
    const account = {eMail, dateJoined, investedSum };
    debugLog(`Creating new account with values: ${JSON.stringify(account)}`);
    const accountNr = await accountRepo.create(account);
    // Get the account
    return getById(accountNr);
}

module.exports = {
    getAll,
    getById,
    getByEmail,
    create,
    updateById,
    deleteById,
}
