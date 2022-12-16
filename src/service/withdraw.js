const withdrawRepo = require("../repository/withdraw");
const { getLogger } = require('../core/logging');
const accountRepo = require("../repository/account");
const ServiceError = require('../core/serviceError');
const { formatOutgoingAccount } = require('./account');

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

const formatOutgoingWithdraw = (withdraw) => {
    // Throw ServiceError if the withdraw does not exist
    if (!withdraw) throw ServiceError.notFound('Withdraw does not exist');
    if (withdraw === undefined) throw ServiceError.notFound('Withdraw does not exist');
    return {
        account: formatOutgoingAccount({accountNr:withdraw.accountNr, 
        "e-mail": withdraw["e-mail"],
        "date joined": withdraw["date joined"],
        "invested sum": withdraw["invested sum"]
    }),
        date: Math.floor(new Date(withdraw.date).getTime() / 1000),
        sum: withdraw.sum
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
 * @returns All withdraws
 */
const getAll = async () => {
    debugLog('Fetching all withdraws');
    let items = await withdrawRepo.findAll();
    items = items.map(formatOutgoingWithdraw);
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
 * @returns undefined if the withdraw does not exist
 * @throws Error if the withdraw could not be retrieved
 */
const getById = async ({accountNr, date}) => {
    debugLog(`Fetching withdraw with key ${date} and ${accountNr}`);
    date = formatIncomingDate(date);    
    try {   
        const withdraw = await withdrawRepo.findById({date, accountNr});
        return formatOutgoingWithdraw(withdraw);
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error fetching withdraw with key ${date} and ${accountNr}`, err);
        // Throw ServiceError
        throw ServiceError.notFound(`Withdraw with key ${date} and ${accountNr} does not exist`);
    }
}

/**
 * Updates a withdraw
 * @param {*} key with date and accountNr
 * @param {*} sum
 * @returns Updated withdraw
 * @throws Error if the withdraw could not be updated
 */
const updateById = async ({accountNr, date}, {sum}) => {
    const originalDate = date;
    try {
        debugLog(`Updating withdraw with key ${date} and ${accountNr}, new values: ${JSON.stringify({sum})}`);
        date = formatIncomingDate(date);
        await withdrawRepo.update({date, accountNr}, {sum});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating withdraw with key ${date} and ${accountNr}`, err);
        // Throw ServiceError
        throw ServiceError.internalServerError(`Error updating withdraw with key ${date} and ${accountNr}`);
    }
    return getById({date: originalDate, accountNr});

}

/**
 * 
 * @param {*} Key with date and accountNr
 * @returns True if the withdraw was deleted, false if the withdraw did not exist
 * @throws Error if the withdraw could not be deleted 
 */
const deleteById = async ({accountNr, date}) => {
    debugLog(`Deleting withdraw with key ${date} and ${accountNr}`);
    date = formatIncomingDate(date);
    const withdraw = await withdrawRepo.findById({date, accountNr});
    if (!withdraw) { throw ServiceError.notFound(`Withdraw with key ${date} and ${accountNr} does not exist`) }
    else {
        try {
            await withdrawRepo.deleteById({date, accountNr});
            return true;
        }
        catch (err) {
            const logger = getLogger();
            logger.error(`Error deleting withdraw with key ${date} and ${accountNr}`, err);
            throw ServiceError.internalServerError(`Error deleting withdraw with key ${date} and ${accountNr}`);
        }
    }
}

/**
 * 
 * @param {*} Object with date, accountNr and sum 
 * @returns Created withdraw
 * @returns null if the withdraw already exists, or if the account could not be found
 */
const create = async ({ accountNr, date, sum}) => {
    debugLog(`Creating withdraw with values ${JSON.stringify({ accountNr, date, sum})}`);
    // Get the current withdraw
    const originalDate = date;
    date = formatIncomingDate(date);
    const withdraw = await withdrawRepo.findById({date, accountNr});
    if (withdraw) {throw ServiceError.conflict(`Withdraw with key ${date} and ${accountNr} already exists`)}
    else {
        // Check if the account exists
        const account = await accountRepo.findById(accountNr);
        if (!account) {
            throw ServiceError.notFound(`Account with key ${accountNr} does not exist`);
        }
        else {
            try {
                await withdrawRepo.create({accountNr, date, sum});
                return getById({date:originalDate, accountNr});
            }
            catch (err) {
                const logger = getLogger();
                logger.error(`Error creating withdraw with values ${JSON.stringify({ accountNr, date, sum})}`, err);
                throw ServiceError.internalServerError(`Error creating withdraw with values ${JSON.stringify({ accountNr, date, sum})}`);
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
