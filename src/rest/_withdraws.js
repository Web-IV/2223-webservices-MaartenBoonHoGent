const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/withdraw');
const validate = require('./_validation.js');

// Withdraw exists of the following elements: accountNr, date, amount, accountNr and date are primary key
// Methods: create, delete, update, find, find by accountNr, find all

const getAllWithdraws = async (ctx) => {
    ctx.body = await service.getAll();
}

const getByAccountNr = async (ctx) => {
    ctx.body = await service.getByAccountNr(ctx.params.accountNr);
}
getByAccountNr.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}

const getByDate = async (ctx) => {
    ctx.body = await service.getByDate(ctx.params.date);
}
getByDate.validationScheme = {
    params: {
        date: Joi.date().required(),
    }
}

const getByKey = async (ctx) => {
    ctx.body = await service.getByKey(ctx.params.accountNr, ctx.params.date);
}
getByKey.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().required(),
    }
}

const createWithdraw = async (ctx) => {
    ctx.body = await service.create(ctx.request.body);
}
createWithdraw.validationScheme = {
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().required(),
        amount : Joi.number().integer().positive().required(),
    }
}

const updateWithdraw = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.accountNr, ctx.params.date, ctx.request.body);
}
updateWithdraw.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().required(),
    },
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().required(),
        amount : Joi.number().integer().positive().required(),
    }
}

const deleteWithdraw = async (ctx) => {
    ctx.body = await service.deleteById(ctx.params.accountNr, ctx.params.date);
}

deleteWithdraw.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().required(),
    }
}

// Router

module.exports = (app) => {
    const router = new Router({prefix: '/withdraws'});
    router.get('/', validate(getAllWithdraws.validationScheme), getAllWithdraws);
    router.get('/:accountNr', validate(getByAccountNr.validationScheme), getByAccountNr);
    router.get('/:date', validate(getByDate.validationScheme), getByDate);
    router.get('/:accountNr/:date', validate(getByKey.validationScheme), getByKey);
    router.post('/', validate(createWithdraw.validationScheme), createWithdraw);
    router.put('/:accountNr/:date', validate(updateWithdraw.validationScheme), updateWithdraw);
    router.delete('/:accountNr/:date', validate(deleteWithdraw.validationScheme), deleteWithdraw);
    
    app.use(router.routes()).use(router.allowedMethods());
}
