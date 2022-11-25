const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/account');
const validate = require('./_validation.js');


// Create, delete, update, find by email, find by account id, find all
// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

/**
 * Gets all accounts
 * @param {*} ctx 
 */
const getAllAccounts = async (ctx) => {
    ctx.body = await service.getAll();
};
getAllAccounts.validationScheme = null;

/**
 * Creates an account and returns the created account
 * @param {*} ctx 
 */
const createAccount = async (ctx) => {
    ctx.body = await service.create({eMail: ctx.request.body.eMail, 
        dateJoined: ctx.request.body.dateJoined, 
        investedSum: ctx.request.body.investedSum});
}
createAccount.validationScheme = {
    body: {
        eMail: Joi.string().email().required(),
        dateJoined: Joi.date().required(),
        investedSum: Joi.number().required(),
    }
}

/**
 * Updates an account and returns the updated account
 * @param {*} ctx 
 */
const updateAccount = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.accountNr, ctx.request.body);
}
updateAccount.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    },
    body: {
        eMail : Joi.string().email().required(),
        dateJoined : Joi.date().required(),
        investedSum : Joi.number().integer().positive().required(),
    }
}

/**
 * Deletes an account and returns true if the account was deleted
 * @param {*} ctx 
 */
const deleteAccount = async (ctx) => {
    ctx.body = await service.deleteById(ctx.params.accountNr);
}
deleteAccount.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}

/**
 * Gets an account by id
 * @param {*} ctx 
 */
const getAccountById = async (ctx) => {
    ctx.body = await service.getById(ctx.params.accountNr);
}
getAccountById.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}

/**
 * Gets an account by email
 * @param {*} ctx 
 */
const getAccountByEmail = async (ctx) => {
    ctx.body = await service.getByEmail(ctx.params.email);
}
getAccountByEmail.validationScheme = {
    params: {
        email: Joi.string().email().required(),
    }
}

// Export router
module.exports = (app) => {
    const router = new Router({ prefix: '/accounts' });

    router.get('/', validate(getAllAccounts.validationScheme), getAllAccounts);
    router.get('/:accountNr', validate(getAccountById.validationScheme), getAccountById);
    router.get('/email/:email', validate(getAccountByEmail.validationScheme), getAccountByEmail);
    router.post('/', validate(createAccount.validationScheme), createAccount);
    router.put('/:accountNr', validate(updateAccount.validationScheme), updateAccount);
    router.delete('/:accountNr', validate(deleteAccount.validationScheme), deleteAccount);

    app.use(router.routes()).use(router.allowedMethods());
};