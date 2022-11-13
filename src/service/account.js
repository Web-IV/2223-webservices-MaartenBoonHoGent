const accountRepo = require("../repository/account");
const { getLogger } = require('../core/logging');

// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};
  

const getAll = async () => {
    debugLog('Fetching all transactions');
    const items = await accountRepo.findAll();
    const count = items.length;
    return {
      items,
      count,
    };
};

const getById = async (id) => {
    debugLog(`Fetching transaction with id ${id}`);
    const account = await accountRepo.findById(id);

    if (!account) { throw new Error(`Transaction with id ${id} not found`); }
    return account;
}

const getByEmail = async (eMail) => {
    debugLog(`Fetching transaction with eMail ${eMail}`);
    const account = await accountRepo.findByEmail(eMail);

    if (!account) { throw new Error(`Transaction with eMail ${eMail} not found`); }
    return account;
};

const updateById = async (accountNr, { eMail, dateJoined, investedSum, password}) => {
    debugLog(`Updating transaction with id ${accountNr}, new values: ${JSON.stringify({eMail, dateJoined, investedSum, password})}`);
    
    // Find the account
    const account = await accountRepo.findById(accountNr);
    if (!account) { throw new Error(`Account with id ${accountNr} not found`); }
    else {
        await accountRepo.update({accountNr, eMail, dateJoined, investedSum, password});
    }

    return getById(accountNr);
}

const deleteById = async (accountNr) => {
    debugLog(`Deleting transaction with id ${accountNr}`);
    const account = await accountRepo.findById(accountNr);
    if (!account) { throw new Error(`Account with id ${accountNr} not found`); }
    else {
        await accountRepo.deleteById(accountNr);
    }
}

const create = async ({eMail, dateJoined, investedSum, password}) => {
    const account = {eMail, dateJoined, investedSum, password };
    debugLog(`Creating new account with values: ${JSON.stringify(account)}`);
    const accountNr = await accountRepo.create(account);
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
