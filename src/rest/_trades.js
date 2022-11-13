const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/trade');
const validate = require('./_validation.js');


// Trade exists of the following elements: tradeNr, accountNr, date, stock, amount, price, total
// Methods: create, delete, update, find by tradeNr, find by accountNr, find all

const getAllTrades = async (ctx) => {
    ctx.body = await service.getAll();
}
getAllTrades.validationScheme = null;

const getByTradeNr = async (ctx) => {
    ctx.body = await service.getByTradeNr(ctx.params.tradeNr);
}
getByTradeNr.validationScheme = {
    params: {
        tradeNr: Joi.number().integer().positive().required(),
    }
}

const getByAccountNr = async (ctx) => {
    ctx.body = await service.getByAccountNr(ctx.params.accountNr);
}
getByAccountNr.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}

const createTrade = async (ctx) => {
    ctx.body = await service.create(ctx.request.body);
}
createTrade.validationScheme = {
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().required(),
        stock : Joi.string().required(),
        amount : Joi.number().integer().positive().required(),
        price : Joi.number().integer().positive().required(),
        total : Joi.number().integer().positive().required(),
    }
}

const updateTrade = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.tradeNr, ctx.request.body);
}
updateTrade.validationScheme = {
    params: {
        tradeNr: Joi.number().integer().positive().required(),
    },
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().required(),
        stock : Joi.string().required(),
        amount : Joi.number().integer().positive().required(),
        price : Joi.number().integer().positive().required(),
        total : Joi.number().integer().positive().required(),
    }
}

const deleteTrade = async (ctx) => {
    ctx.body = await service.deleteById(ctx.params.tradeNr);
}
deleteTrade.validationScheme = {
    params: {
        tradeNr: Joi.number().integer().positive().required(),
    }
}

// Router
module.exports = (app) => {
    const router = new Router({prefix : '/trades'});

    router.get("/", validate(getAllTrades.validationScheme), getAllTrades);
    router.get("/:tradeNr", validate(getByTradeNr.validationScheme), getByTradeNr);
    router.get("/account/:accountNr", validate(getByAccountNr.validationScheme), getByAccountNr);
    router.post("/", validate(createTrade.validationScheme), createTrade);
    router.put("/:tradeNr", validate(updateTrade.validationScheme), updateTrade);
    router.delete("/:tradeNr", validate(deleteTrade.validationScheme), deleteTrade);

    app.use(router.routes()).use(router.allowedMethods());
}
