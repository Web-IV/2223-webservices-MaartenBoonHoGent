const withdrawRepo = require("../repository/withdraw");
const { getLogger } = require('../core/logging');
const accountRepo = require("../repository/account");

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

/**
 * 
 * @returns All withdraws
 */
const getAll = async () => {
    debugLog('Fetching all withdraws');
    const items = await withdrawRepo.findAll();
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
    
    try {
        const withdraw = await withdrawRepo.findById({date, accountNr});
        if (!withdraw) { return null; }
        return withdraw;
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error fetching withdraw with key ${date} and ${accountNr}`, err);
        throw err;
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
    try {
        debugLog(`Updating withdraw with key ${date} and ${accountNr}, new values: ${JSON.stringify({sum})}`);
        await withdrawRepo.update({date, accountNr}, {sum});
        return getById({date, accountNr});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating withdraw with key ${date} and ${accountNr}`, err);
        throw err;
    }

}

/**
 * 
 * @param {*} Key with date and accountNr
 * @returns True if the withdraw was deleted, false if the withdraw did not exist
 * @throws Error if the withdraw could not be deleted 
 */
const deleteById = async ({accountNr, date}) => {
    debugLog(`Deleting withdraw with key ${date} and ${accountNr}`);
    const withdraw = await withdrawRepo.findById({date, accountNr});
    if (!withdraw) { return false; }
    else {
        try {
            await withdrawRepo.deleteById({date, accountNr});
            return true;
        }
        catch (err) {
            const logger = getLogger();
            logger.error(`Error deleting withdraw with key ${date} and ${accountNr}`, err);
            throw err;
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
    const withdraw = await withdrawRepo.findById({date, accountNr});
    if (withdraw) {return null;}

    else {
        // Check if the account exists
        const account = await accountRepo.findById(accountNr);
        if (!account) {
            return null;
        }
        else {
            try {
                await withdrawRepo.create({accountNr, date, sum});
                return getById({date, accountNr});
            }
            catch (err) {
                const logger = getLogger();
                logger.error(`Error creating withdraw with values ${JSON.stringify({ accountNr, date, sum})}`, err);
                return null;
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
