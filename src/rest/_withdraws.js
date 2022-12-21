const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/withdraw');
const {hasPermission, permissions} = require('../core/auth');
const validate = require('./_validation.js');
const { checkUser } = require('./_user');


// Withdraw exists of the following elements: accountNr, date, sum, accountNr and date are primary key
// Methods: create, delete, update, find, find by accountNr, find all

/**
 * Gets all withdraws
 * @param {*} ctx 
 */

const getAllWithdraws = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getAll();
}
getAllWithdraws.validationScheme = null;

/**
 * Gets a withdraw by its key
 * @param {*} ctx 
 */
const getByKey = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getById({accountNr: ctx.params.accountNr, date: ctx.params.date});
}
getByKey.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().raw().required(),
    }
}

/**
 * Creates a withdraw
 * @param {*} ctx 
 */
const createWithdraw = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.create(ctx.request.body);
    ctx.status = 201;

}

createWithdraw.validationScheme = {
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().raw().required(),
        sum : Joi.number().integer().positive().required(),
    }
}

/**
 * Updates a withdraw
 * @param {*} ctx 
 */
const updateWithdraw = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.updateById({accountNr: ctx.params.accountNr, date: ctx.params.date}, {sum: ctx.request.body.sum});
}
updateWithdraw.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().raw().required(),
    },
    body: {
        sum : Joi.number().integer().positive().required(),
    }
}

/**
 * Deletes a withdraw by its key
 * 
 * @param {*} ctx 
 */
const deleteWithdraw = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.deleteById({accountNr: ctx.params.accountNr, date: ctx.params.date});
    ctx.status = 204;

}
deleteWithdraw.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().raw().required(),
    }

}


// Router
module.exports = (app) => {
    const router = new Router({ prefix: '/withdraws' });
    
    router.get('/', hasPermission(permissions.read), validate(getAllWithdraws.validationScheme), getAllWithdraws);
    router.get('/:accountNr/:date', hasPermission(permissions.read), validate(getByKey.validationScheme), getByKey);
    router.post('/', hasPermission(permissions.write), validate(createWithdraw.validationScheme), createWithdraw);
    router.put('/:accountNr/:date', hasPermission(permissions.write), validate(updateWithdraw.validationScheme), updateWithdraw);
    router.delete('/:accountNr/:date', hasPermission(permissions.write), validate(deleteWithdraw.validationScheme), deleteWithdraw);

    app.use(router.routes()).use(router.allowedMethods());
}