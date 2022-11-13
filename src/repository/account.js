const { tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');
// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

const findAll = async () => {
    return getKnex()(tables.account).select().orderBy('accountNr');
}

const findById = async (accountNr) => {
    return getKnex()(tables.account).select().where('accountNr', accountNr).first();
}

const findByEmail = async (email) => {
    return getKnex()(tables.account).select().where('e-mail', email).first();
}

const create = async ({eMail, dateJoined, investedSum, password}) => {
    try {
        await getKnex()(tables.account).insert({
            'e-mail': eMail, 
            'date joined': dateJoined, 
            'invested sum': investedSum, 
            'password': password});
    }
    catch (err) {
        const logger = getLogger();
        logger.error(`Error creating account with values ${JSON.stringify({eMail, dateJoined, investedSum, password})}`, err);
        throw err;
    }
}

const update = async (accountNr, {eMail, dateJoined, investedSum, password}) => {
    try {
        await getKnex()(tables.account).where('accountNr', accountNr).update({
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





