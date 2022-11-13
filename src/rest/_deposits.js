const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/deposit');
const validate = require('./_validation.js');


// Deposit exists of the following elements: accountNr, date, sum, accountNr and date are primary key
// Methods: create, delete, update, find, find by accountNr, find all

const getAllDeposits = async (ctx) => {
    ctx.body = await service.getAll();
}
getAllDeposits.validationScheme = null;

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

const updateDeposit = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.accountNr, ctx.params.date, ctx.request.body);
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

const deleteDeposit = async (ctx) => {
    ctx.body = await service.deleteById(ctx.params.accountNr, ctx.params.date);
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
    router.get('/:accountNr', validate(getByAccountNr.validationScheme), getByAccountNr);
    router.get('/:date', validate(getByDate.validationScheme), getByDate);
    router.get('/:accountNr/:date', validate(getByKey.validationScheme), getByKey);
    router.post('/', validate(createDeposit.validationScheme), createDeposit);
    router.put('/:accountNr/:date', validate(updateDeposit.validationScheme), updateDeposit);
    router.delete('/:accountNr/:date', validate(deleteDeposit.validationScheme), deleteDeposit);

    app.use(router.routes()).use(router.allowedMethods());
}