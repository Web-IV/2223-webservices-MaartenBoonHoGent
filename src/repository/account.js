const { tables, getIndex} = require('../data/index');
const { getLogger } = require('../core/logging');
// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

const findAll = async () => {
    return getKnex(tables.ACCOUNTS).select().orderBy('accountNr');
}

const findCount = async () => {
    return getKnex(tables.ACCOUNTS).count('accountNr');
}


const findById = async (accountNr) => {
    return getKnex(tables.ACCOUNTS).select().where('accountNr', accountNr).first();
}

const findByEmail = async (email) => {
    return getKnex(tables.ACCOUNTS).select().where('email', email).first();
}

const create = async ({eMail, dateJoined, investedSum, password}) => {
    try {
        const [accountNr] = await getKnex(tables.ACCOUNTS).insert({
            'e-mail': eMail, 
            'date joined': dateJoined, 
            'invested sum': investedSum, 
            'password': password});
        return accountNr;
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error creating account with values ${JSON.stringify(account)}`, err);
        throw err;
    }
}

const update = async (accountNr, {eMail, dateJoined, investedSum, password}) => {
    try {
        await getKnex(tables.ACCOUNTS).where('accountNr', accountNr).update({
            'e-mail': eMail, 
            'date joined': dateJoined, 
            'invested sum': investedSum, 
            'password': password});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error updating account with id ${accountNr}`, err);
        throw err;
    }
};

const deleteById = async (accountNr) => {
    try {
        await getKnex(tables.ACCOUNTS).where('accountNr', accountNr).del();
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error deleting account with id ${accountNr}`, err);
        throw err;
    }
};

module.exports = {
    findAll,
    findCount,
    findById,
    findByEmail,
    create,
    update,
    deleteById
}





