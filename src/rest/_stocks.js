const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/stock');
const validate = require('./_validation.js');

// Stock exists of the following elements: stockId, symbol, name, industry, sector, IPO date, date of incorporation
// Methods: create, delete, update, find by stockId, find by symbol, find all

const getAllStocks = async (ctx) => {
    ctx.body = await service.getAll();
}
getAllStocks.validationScheme = null;

const createStock = async (ctx) => {
    ctx.body = await service.create(ctx.request.body);
}
createStock.validationScheme = {
    body: {
        symbol : Joi.string().required(),
        name : Joi.string().required(),
        industry : Joi.string().required(),
        sector : Joi.string().required(),
        IPOdate : Joi.date().required(),
        dateOfIncorporation : Joi.date().required(),
    }
}

const updateStock = async (ctx) => {
    ctx.body = await service.updateById(ctx.params.stockId, ctx.request.body);
}
updateStock.validationScheme = {
    params: {
        stockId: Joi.number().integer().positive().required(),
    },
    body: {
        symbol : Joi.string().required(),
        name : Joi.string().required(),
        industry : Joi.string().required(),
        sector : Joi.string().required(),
        IPOdate : Joi.date().required(),
        dateOfIncorporation : Joi.date().required(),
    }
}

const deleteStock = async (ctx) => {
    ctx.body = await service.deleteById(ctx.params.stockId);
}
deleteStock.validationScheme = {
    params: {
        stockId: Joi.number().integer().positive().required(),
    }
}

const getByStockId = async (ctx) => {
    ctx.body = await service.getById(ctx.params.stockId);
}

getByStockId.validationScheme = {
    params: {
        stockId: Joi.number().integer().positive().required(),
    }
}

const getBySymbol = async (ctx) => {
    ctx.body = await service.getBySymbol(ctx.params.symbol);
}

getBySymbol.validationScheme = {
    params: {
        symbol: Joi.string().required(),
    }
}

// Router

module.exports = (app) => {
    const router = new Router({ prefix: '/stocks' });
    router.get("/", validate(getAllStocks.validationScheme), getAllStocks);
    router.post("/", validate(createStock.validationScheme), createStock);
    router.put("/:stockId", validate(updateStock.validationScheme), updateStock);
    router.delete("/:stockId", validate(deleteStock.validationScheme), deleteStock);
    router.get("/:stockId", validate(getByStockId.validationScheme), getByStockId);
    router.get("/symbol/:symbol", validate(getBySymbol.validationScheme), getBySymbol);
    app.use(router.routes()).use(router.allowedMethods());
}