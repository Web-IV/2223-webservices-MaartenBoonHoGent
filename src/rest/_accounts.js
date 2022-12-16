const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/account');
const validate = require('./_validation.js');
const { response } = require('express');


// Create, delete, update, find by "e-mail", find by account id, find all
// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

/**
 * Gets all accounts
 * @param {*} ctx 
 */

const formatInput = (ctx) => {
    return {
        eMail: ctx.request.body["e-mail"],
        dateJoined: ctx.request.body["date joined"],
        investedSum: ctx.request.body["invested sum"]
    }
}

const getAllAccounts = async (ctx) => {
    ctx.body = await service.getAll();
};
getAllAccounts.validationScheme = null;

/**
 * Creates an account and returns the created account
 * @param {*} ctx 
 */
const createAccount = async (ctx) => {
    let response = await service.create(formatInput(ctx));
    ctx.body = response;
    ctx.status = 201;
    
}
createAccount.validationScheme = {
    body: {
        "e-mail": Joi.string().email().required(),
        "date joined": Joi.date().raw().required(),
        "invested sum": Joi.number().required(),
    }
}

/**
 * Updates an account and returns the updated account
 * @param {*} ctx 
 */
const updateAccount = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.accountNr, formatInput(ctx));
}
updateAccount.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    },
    body: {
        "e-mail" : Joi.string().email().required(),
        "date joined" : Joi.date().required(),
        "invested sum" : Joi.number().integer().positive().required(),
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
    let response = await service.getById(ctx.params.accountNr);
    ctx.body = response;
}
getAccountById.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}

/**
 * Gets an account by e-mail
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
    router.get('/e-mail/:email', validate(getAccountByEmail.validationScheme), getAccountByEmail);
    router.post('/', validate(createAccount.validationScheme), createAccount);
    router.put('/:accountNr', validate(updateAccount.validationScheme), updateAccount);
    router.delete('/:accountNr', validate(deleteAccount.validationScheme), deleteAccount);

    app.use(router.routes()).use(router.allowedMethods());
};