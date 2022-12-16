const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/withdraw');
const validate = require('./_validation.js');


// Withdraw exists of the following elements: accountNr, date, sum, accountNr and date are primary key
// Methods: create, delete, update, find, find by accountNr, find all

/**
 * Gets all withdraws
 * @param {*} ctx 
 */

const getAllWithdraws = async (ctx) => {
    ctx.body = await service.getAll();
}
getAllWithdraws.validationScheme = null;

/**
 * Gets a withdraw by its key
 * @param {*} ctx 
 */
const getByKey = async (ctx) => {
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
    ctx.body = await service.create(ctx.request.body);

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
    ctx.body = await service.deleteById({accountNr: ctx.params.accountNr, date: ctx.params.date});

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
    
    router.get('/', validate(getAllWithdraws.validationScheme), getAllWithdraws);
    router.get('/:accountNr/:date', validate(getByKey.validationScheme), getByKey);
    router.post('/', validate(createWithdraw.validationScheme), createWithdraw);
    router.put('/:accountNr/:date', validate(updateWithdraw.validationScheme), updateWithdraw);
    router.delete('/:accountNr/:date', validate(deleteWithdraw.validationScheme), deleteWithdraw);

    app.use(router.routes()).use(router.allowedMethods());
}