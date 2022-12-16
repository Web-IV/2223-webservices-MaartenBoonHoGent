const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/trade');
const validate = require('./_validation.js');


// Trade exists of the following elements: tradeNr, date, stock, amount, price, total
// Methods: create, delete, update, find by tradeNr, find all

/**
 * Get all trades
 * @param {*} ctx 
 */
const getAllTrades = async (ctx) => {
    ctx.body = await service.getAll();
}
getAllTrades.validationScheme = null;

/**
 * Get a trade by its tradeNr
 * @param {*} ctx 
 */
const getByTradeNr = async (ctx) => {
    ctx.body = await service.getById(ctx.params.tradeNr);
    
}
getByTradeNr.validationScheme = {
    params: {
        tradeNr: Joi.number().integer().positive().required(),
    }
}

/**
 * Create a trade
 * @param {*} ctx 
 */
const createTrade = async (ctx) => {
    ctx.body = await service.create({
        stockId: ctx.request.body["stockId"], 
        amount: ctx.request.body["amount"],
        priceBought: ctx.request.body["price bought"],
        priceSold: ctx.request.body["price sold"],
        dateBought: ctx.request.body["date bought"],
        dateSold: ctx.request.body["date sold"],
        commentBought: ctx.request.body["comment bought"],
        commentSold: ctx.request.body["comment sold"],
        });
}
createTrade.validationScheme = {
    body: {
        stockId : Joi.number().integer().positive().required(),
        amount : Joi.number().integer().positive().required(),
        "price bought": Joi.number().integer().positive().required(),
        "price sold": Joi.number().integer().positive().required(),
        "date bought": Joi.date().raw().required(),
        "date sold": Joi.date().raw().required(),
        "comment bought": Joi.string().allow(null).allow('').optional().default("No comment"),
        "comment sold": Joi.string().allow(null).allow('').optional().default("No comment"),
    }
}

/**
 * Update a trade
 * @param {*} ctx 
 */
const updateTrade = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.tradeNr, 
        {
            stockId: ctx.request.body["stockId"], 
            amount: ctx.request.body["amount"],
            priceBought: ctx.request.body["price bought"],
            priceSold: ctx.request.body["price sold"],
            dateBought: ctx.request.body["date bought"],
            dateSold: ctx.request.body["date sold"],
            commentBought: ctx.request.body["comment bought"],
            commentSold: ctx.request.body["comment sold"],
            });
}
updateTrade.validationScheme = {
    params: {
        tradeNr: Joi.number().integer().positive().required(),
    },
    body: {
        stockId : Joi.number().integer().positive().required(),
        amount : Joi.number().integer().positive().required(),
        "price bought": Joi.number().integer().positive().required(),
        "price sold": Joi.number().integer().positive().required(),
        "date bought": Joi.date().raw().required(),
        "date sold": Joi.date().raw().required(),
        "comment bought": Joi.string().allow(null).allow('').optional().default("No comment"),
        "comment sold": Joi.string().allow(null).allow('').optional().default("No comment"),
    }
}

/**
 * Delete a trade
 * @param {*} ctx 
 */
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
    router.post("/", validate(createTrade.validationScheme), createTrade);
    router.put("/:tradeNr", validate(updateTrade.validationScheme), updateTrade);
    router.delete("/:tradeNr", validate(deleteTrade.validationScheme), deleteTrade);

    app.use(router.routes()).use(router.allowedMethods());
}
