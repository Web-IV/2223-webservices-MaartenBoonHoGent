const withdrawRepo = require("../repository/withdraw");
const { getLogger } = require('../core/logging');

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};
const getAll = async () => {
    debugLog('Fetching all withdraws');
    const items = await withdrawRepo.findAll();
    const count = await withdrawRepo.findCount();
    return {
        items,
        count,
    };
}

const getById = async ({date, accountNr}) => {
    debugLog(`Fetching withdraw with key ${date} and ${accountNr}`);
    const withdraw = await withdrawRepo.findById({date, accountNr});

    if (!withdraw) { throw new Error(`Withdraw with key ${date} and ${accountNr} not found`); }
    return withdraw;
}

const updateById = async ({date, accountNr}, {sum}) => {
    debugLog(`Updating withdraw with key ${date} and ${accountNr}, new values: ${JSON.stringify({sum})}`);
    await withdrawRepo.update({date, accountNr}, {sum});
    return getById({date, accountNr});
}

const deleteById = async ({date, accountNr}) => {
    debugLog(`Deleting withdraw with key ${date} and ${accountNr}`);
    const withdraw = await withdrawRepo.findById({date, accountNr});
    if (!withdraw) { throw new Error(`Withdraw with key ${date} and ${accountNr} not found`); }
    else {
        await withdrawRepo.deleteById({date, accountNr});
    }
}

const create = async ({ date, accountNr, sum}) => {
    debugLog(`Creating withdraw with values ${JSON.stringify(withdraw)}`);
    // Get the current withdraw
    const withdraw = await withdrawRepo.findById({date, accountNr});
    if (withdraw) {
        throw new Error(`Withdraw with key ${date} and ${accountNr} already exists`);
    }
    else {
        await withdrawRepo.create({date, accountNr, sum});
    }
    return getById({date, accountNr});
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
