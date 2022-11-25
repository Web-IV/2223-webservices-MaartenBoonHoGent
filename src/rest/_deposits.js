const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/deposit');
const validate = require('./_validation.js');


// Deposit exists of the following elements: accountNr, date, sum, accountNr and date are primary key
// Methods: create, delete, update, find, find by accountNr, find all

/**
 * Gets all deposits
 * @param {*} ctx 
 */

const getAllDeposits = async (ctx) => {
    ctx.body = await service.getAll();
}
getAllDeposits.validationScheme = null;

/**
 * Gets a deposit by its key
 * @param {*} ctx 
 */
const getByKey = async (ctx) => {
    ctx.body = await service.getById({accountNr: ctx.params.accountNr, date: ctx.params.date});
}
getByKey.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().required(),
    }
}

/**
 * Creates a deposit
 * @param {*} ctx 
 */
const createDeposit = async (ctx) => {
    ctx.body = await service.create(ctx.request.body);
}

createDeposit.validationScheme = {
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().required(),
        sum : Joi.number().integer().positive().required(),
    }
}

/**
 * Updates a deposit
 * @param {*} ctx 
 */
const updateDeposit = async (ctx) => {
    ctx.body = await service.updateById({accountNr: ctx.params.accountNr, date: ctx.params.date}, {sum: ctx.request.body.sum});
}
updateDeposit.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().required(),
    },
    body: {
        sum : Joi.number().integer().positive().required(),
    }
}

/**
 * Deletes a deposit by its key
 * 
 * @param {*} ctx 
 */
const deleteDeposit = async (ctx) => {
    ctx.body = await service.deleteById({accountNr: ctx.params.accountNr, date: ctx.params.date});
}
deleteDeposit.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().required(),
    }

}


// Router
module.exports = (app) => {
    const router = new Router({ prefix: '/deposits' });
    
    router.get('/', validate(getAllDeposits.validationScheme), getAllDeposits);
    router.get('/:accountNr/:date', validate(getByKey.validationScheme), getByKey);
    router.post('/', validate(createDeposit.validationScheme), createDeposit);
    router.put('/:accountNr/:date', validate(updateDeposit.validationScheme), updateDeposit);
    router.delete('/:accountNr/:date', validate(deleteDeposit.validationScheme), deleteDeposit);

    app.use(router.routes()).use(router.allowedMethods());
}