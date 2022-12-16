const depositRepo = require("../repository/deposit");
const { getLogger } = require('../core/logging');
const accountRepo = require("../repository/account");
const ServiceError = require('../core/serviceError');
const { formatOutgoingAccount } = require('./account');

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

const formatOutgoingDeposit = (deposit) => {
    // Throw ServiceError if the deposit does not exist
    if (!deposit) throw ServiceError.notFound('Deposit does not exist');
    if (deposit === undefined) throw ServiceError.notFound('Deposit does not exist');
    return {
        account: formatOutgoingAccount({accountNr:deposit.accountNr, 
        "e-mail": deposit["e-mail"],
        "date joined": deposit["date joined"],
        "invested sum": deposit["invested sum"]
    }),
        date: Math.floor(new Date(deposit.date).getTime() / 1000),
        sum: deposit.sum
    };
}

const formatIncomingDate = (date) => {
    if (!date) return null;
    if (date === undefined) return null;
    //  is currently timestamp in seconds
    return new Date(date * 1000); 
}

/**
 * 
 * @returns All deposits
 */
const getAll = async () => {
    debugLog('Fetching all deposits');
    let items = await depositRepo.findAll();
    items = items.map(formatOutgoingDeposit);
    const count = items.length;
    return {
      items,
      count,
    };
}

/**
 * 
 * @param {*} Object with date and accountNr 
 * @returns Object with date, accountNr and sum
 * @returns undefined if the deposit does not exist
 * @throws Error if the deposit could not be retrieved
 */
const getById = async ({accountNr, date}) => {
    debugLog(`Fetching deposit with key ${date} and ${accountNr}`);
    date = formatIncomingDate(date);    
    try {   
        const deposit = await depositRepo.findById({date, accountNr});
        return formatOutgoingDeposit(deposit);
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error fetching deposit with key ${date} and ${accountNr}`, err);
        // Throw ServiceError
        throw ServiceError.notFound(`Deposit with key ${date} and ${accountNr} does not exist`);
    }
}

/**
 * Updates a deposit
 * @param {*} key with date and accountNr
 * @param {*} sum
 * @returns Updated deposit
 * @throws Error if the deposit could not be updated
 */
const updateById = async ({accountNr, date}, {sum}) => {
    const originalDate = date;
    try {
        debugLog(`Updating deposit with key ${date} and ${accountNr}, new values: ${JSON.stringify({sum})}`);
        date = formatIncomingDate(date);
        await depositRepo.update({date, accountNr}, {sum});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating deposit with key ${date} and ${accountNr}`, err);
        // Throw ServiceError
        throw ServiceError.internalServerError(`Error updating deposit with key ${date} and ${accountNr}`);
    }
    return getById({date: originalDate, accountNr});

}

/**
 * 
 * @param {*} Key with date and accountNr
 * @returns True if the deposit was deleted, false if the deposit did not exist
 * @throws Error if the deposit could not be deleted 
 */
const deleteById = async ({accountNr, date}) => {
    debugLog(`Deleting deposit with key ${date} and ${accountNr}`);
    date = formatIncomingDate(date);
    const deposit = await depositRepo.findById({date, accountNr});
    if (!deposit) { throw ServiceError.notFound(`Deposit with key ${date} and ${accountNr} does not exist`) }
    else {
        try {
            await depositRepo.deleteById({date, accountNr});
            return true;
        }
        catch (err) {
            const logger = getLogger();
            logger.error(`Error deleting deposit with key ${date} and ${accountNr}`, err);
            throw ServiceError.internalServerError(`Error deleting deposit with key ${date} and ${accountNr}`);
        }
    }
}

/**
 * 
 * @param {*} Object with date, accountNr and sum 
 * @returns Created deposit
 * @returns null if the deposit already exists, or if the account could not be found
 */
const create = async ({ accountNr, date, sum}) => {
    debugLog(`Creating deposit with values ${JSON.stringify({ accountNr, date, sum})}`);
    // Get the current deposit
    const originalDate = date;
    date = formatIncomingDate(date);
    const deposit = await depositRepo.findById({date, accountNr});
    if (deposit) {throw ServiceError.conflict(`Deposit with key ${date} and ${accountNr} already exists`)}
    else {
        // Check if the account exists
        const account = await accountRepo.findById(accountNr);
        if (!account) {
            throw ServiceError.notFound(`Account with key ${accountNr} does not exist`);
        }
        else {
            try {
                await depositRepo.create({accountNr, date, sum});
                return getById({date:originalDate, accountNr});
            }
            catch (err) {
                const logger = getLogger();
                logger.error(`Error creating deposit with values ${JSON.stringify({ accountNr, date, sum})}`, err);
                throw ServiceError.internalServerError(`Error creating deposit with values ${JSON.stringify({ accountNr, date, sum})}`);
            }
        }       
    } 
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
