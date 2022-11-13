const depositRepo = require("../repository/deposit");
const { getLogger } = require('../core/logging');

const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

const getAll = async () => {
    debugLog('Fetching all deposits');
    const items = await depositRepo.findAll();
    const count = items.length;
    return {
      items,
      count,
    };
}

const getById = async ({accountNr, date}) => {
    debugLog(`Fetching deposit with key ${date} and ${accountNr}`);
    const deposit = await depositRepo.findById({date, accountNr});

    if (!deposit) { throw new Error(`Deposit with key ${date} and ${accountNr} not found`); }
    return deposit;
}

const updateById = async ({accountNr, date}, {sum}) => {
    debugLog(`Updating deposit with key ${date} and ${accountNr}, new values: ${JSON.stringify({sum})}`);
    await depositRepo.update({date, accountNr}, {sum});
    return getById({date, accountNr});
}

const deleteById = async ({accountNr, date}) => {
    debugLog(`Deleting deposit with key ${date} and ${accountNr}`);
    const deposit = await depositRepo.findById({date, accountNr});
    if (!deposit) { throw new Error(`Deposit with key ${date} and ${accountNr} not found`); }
    else {
        await depositRepo.deleteById({date, accountNr});
    }
}

const create = async ({ accountNr, date, sum}) => {
    debugLog(`Creating deposit with values ${JSON.stringify(deposit)}`);
    // Get the current deposit
    const deposit = await depositRepo.findById({date, accountNr});
    if (deposit) {
        throw new Error(`Deposit with key ${date} and ${accountNr} already exists`);
    }
    else {
        await depositRepo.create({date, accountNr, sum});
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
