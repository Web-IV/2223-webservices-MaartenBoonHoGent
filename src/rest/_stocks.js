const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/stock');
const validate = require('./_validation.js');
const {hasPermission, permissions} = require('../core/auth');
const { checkUser } = require('./_user');


// Stock exists of the following elements: stockId, symbol, name, industry, sector, IPO date, date of incorporation
// Methods: create, delete, update, find by stockId, find by symbol, find all

/**
 * @openapi
 * tags:
 *   name: Stocks
 *   description: Represents all operations on stocks
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     StocksList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Stock" 
 */

/**
 * @openapi
 * components:
 *   requestBodies: 
 *     InputStock:
 *       description: The stock to create or update
 *       required: True
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - "symbol"
 *               - "name"
 *             properties:
 *               "symbol":
 *                 type: string
 *                 description: The ticker / symbol of the stock
 *                 example: "AAPL"
 *               "name":
 *                 type: string
 *                 description: The name of the stock
 *                 example: "Apple Inc."
 *               "industry":
 *                 type: string
 *                 description: The industry of the stock
 *                 example: "Technology"
 *               "sector":
 *                 type: string
 *                 description: The sector of the stock
 *                 example: "Consumer Electronics"
 */

/**
 * @openapi
 * /api/stocks:
 *   get:
 *    summary: Get all stocks
 *    description: Returns all stocks
 *    tags: 
 *      - Stocks
 *    responses:
 *      200:
 *        description: Returns all stocks
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/StocksList"
 */

const getAllStocks = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getAll();
}
getAllStocks.validationScheme = null;


/**
 * @openapi
 * /api/stocks/{id}:
 *   get:
 *     summary: Get a stock by id
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: "#/components/parameters/stockId"
 *     responses:
 *       200:
 *         description: Returns an stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Stock"
 *       404:
 *         description: stock not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const getByStockId = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getById(ctx.params.stockId);
}

getByStockId.validationScheme = {
    params: {
        stockId: Joi.number().integer().positive().required(),
    }
}

/**
 * @openapi
 * /api/stocks/symbol/{symbol}:
 *   get:
 *     summary: Get a stock by symbol
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: "#/components/parameters/stockSymbol"
 *     responses:
 *       200:
 *         description: Returns an stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Stock"
 *       404:
 *         description: stock not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const getBySymbol = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getBySymbol(ctx.params.symbol);
}

getBySymbol.validationScheme = {
    params: {
        symbol: Joi.string().required(),
    }
}


/**
 * @openapi
 * /api/stocks:
 *   post:
 *     summary: Create a new stock
 *     tags:
 *       - Stocks
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputStock"
 *     responses:
 *       201:
 *         description: Returns the created stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Stock"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/400ValidationError"
 *       409:
 *         description: The stock already exists with the given symbol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/409Conflict"
 */

const createStock = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.create(ctx.request.body);
    ctx.status = 201;
}
createStock.validationScheme = {
    body: {
        symbol : Joi.string().required(),
        name : Joi.string().required(),
        industry : Joi.string().required().default('Unknown'),
        sector : Joi.string().required().default('Unknown')
    }
}


/**
 * @openapi
 * /api/stocks/{id}:
 *   put:
 *     summary: Update a stock
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: "#/components/parameters/stockId"
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputStock"
 *     responses:
 *       200:
 *         description: Returns the updated stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Stock"
 *       404:
 *         description: Stock not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/400ValidationError"
 *       
 */

const updateStock = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.updateById(ctx.params.stockId, ctx.request.body);
}
updateStock.validationScheme = {
    params: {
        stockId: Joi.number().integer().positive().required(),
    },
    body: {
        symbol : Joi.string().required(),
        name : Joi.string().required(),
        industry : Joi.string().required().default('Unknown'),
        sector : Joi.string().required().default('Unknown')
    }
}

/**
 * @openapi
 * /api/stocks/{id}:
 *   delete:
 *     summary: Delete a stock by id
 *     tags:
 *       - Stocks
 *     parameters:
 *       - $ref: "#/components/parameters/stockId"
 *     responses:
 *       204:
 *         description: Returns nothing if the stock was deleted
 *       404:
 *         description: Stock not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */
const deleteStock = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.deleteById(ctx.params.stockId);
    ctx.status = 204;
}
deleteStock.validationScheme = {
    params: {
        stockId: Joi.number().integer().positive().required(),
    }
}

// Router

module.exports = (app) => {
    const router = new Router({ prefix: '/stocks' });
    router.get("/", hasPermission(permissions.read), validate(getAllStocks.validationScheme), getAllStocks);
    router.get("/:stockId", hasPermission(permissions.read), validate(getByStockId.validationScheme), getByStockId);
    router.get("/symbol/:symbol", hasPermission(permissions.read), validate(getBySymbol.validationScheme), getBySymbol);
    router.post("/", hasPermission(permissions.write), validate(createStock.validationScheme), createStock);
    router.put("/:stockId", hasPermission(permissions.write), validate(updateStock.validationScheme), updateStock);
    router.delete("/:stockId", hasPermission(permissions.write), validate(deleteStock.validationScheme), deleteStock);
    app.use(router.routes()).use(router.allowedMethods());
}