const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/account');
const validate = require('./_validation.js');


// Create, delete, update, find by email, find by account id, find all
// Account exists of the following elements: accountNr, e-mail, date joined, invested sum, password

const getAllAccounts = async (ctx) => {
    ctx.body = await service.getAll();
};
getAllAccounts.validationScheme = null;

const createAccount = async (ctx) => {
    ctx.body = await service.create(ctx.request.body);
}

const updateAccount = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.accountNr, ctx.request.body);
}
updateAccount.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    },
    body: {
        email : Joi.string().email().required(),
        password : Joi.string().required(),
        dateJoined : Joi.date().required(),
        investedSum : Joi.number().integer().positive().required(),
    }
}

const deleteAccount = async (ctx) => {
    ctx.body = await service.deleteById(ctx.params.accountNr);
}
deleteAccount.validationScheme = {
    params: {
        id: Joi.number().integer().positive().required(),
    }
}


const getAccountById = async (ctx) => {
    ctx.body = await service.getById(ctx.params.accountNr);
}
getAccountById.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}


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