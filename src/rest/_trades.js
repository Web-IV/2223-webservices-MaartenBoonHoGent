const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/trade');
const validate = require('./_validation.js');
const {hasPermission, permissions} = require('../core/auth');
const { checkUser } = require('./_user');



// Trade exists of the following elements: tradeNr, date, stock, amount, price, total
// Methods: create, delete, update, find by tradeNr, find all
/**
 * @openapi
 * tags:
 *   name: Trades
 *   description: Represents all operations on trades
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     TradesList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Trade"
 * 
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     InputTrade:
 *       description: The trade to create or update
 *       required: True
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - "stock"
 *               - "price bought"
 *               - "price sold"
 *               - "date bought"
 *               - "date sold"
 *               - "amount"
 *             properties:
 *               "tradeId":
 *                 type: integer
 *                 format: int64
 *                 description: The trade id, unique identifier
 *                 example: 1
 *               "stock":
 *                 $ref: "#/components/schemas/Stock"
 *               "price bought":
 *                 type: number
 *                 description: The price the stock was bought at
 *                 example: 100.00
 *               "price sold":
 *                 type: number
 *                 description: The price the stock was sold at
 *                 example: 101.00
 *               "date bought":
 *                 type: integer
 *                 format: date in the format of a timestamp (seconds since epoch)
 *                 description: The date the trade was started
 *                 example: 1610000000
 *               "date sold":
 *                 type: integer
 *                 format: date in the format of a timestamp (seconds since epoch)
 *                 description: The date the trade was ended
 *                 example: 1610005000
 *               "amount":
 *                 type: integer
 *                 format: int64
 *                 description: The amount of stocks bought
 *                 example: 10
 *               "comment bought":
 *                 type: string
 *                 description: The comment for the buy order
 *                 example: "Buy at 100"
 *               "comment sold":
 *                 type: string
 *                 description: The comment for the sell order
 *                 example: "Sell at 100"
 */

/**
 * @openapi
 * /api/trades:
 *   get:
 *    summary: Get all trades
 *    description: Returns all trades
 *    tags: 
 *      - Trades
 *    responses:
 *      200:
 *        description: Returns all trades
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/TradesList"
 */
const getAllTrades = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getAll();
}
getAllTrades.validationScheme = null;

/**
 * @openapi
 * /api/trades/{id}:
 *   get:
 *     summary: Get a trade by id
 *     tags:
 *       - Trades
 *     parameters:
 *       - $ref: "#/components/parameters/tradeId"
 *     responses:
 *       200:
 *         description: Returns a trade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Trade"
 *       404:
 *         description: trade not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const getByTradeNr = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getById(ctx.params.tradeNr);
    
}
getByTradeNr.validationScheme = {
    params: {
        tradeNr: Joi.number().integer().positive().required(),
    }
}

/**
 * @openapi
 * /api/trades:
 *   post:
 *     summary: Create a new trade
 *     tags:
 *       - Trades
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputTrade"
 *     responses:
 *       201:
 *         description: Returns the created trade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Trade"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/400ValidationError"
 */

const createTrade = async (ctx) => {
    checkUser(ctx);
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
    ctx.status = 201;
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
 * @openapi
 * /api/trades/{id}:
 *   put:
 *     summary: Update a trade
 *     tags:
 *       - Trades
 *     parameters:
 *       - $ref: "#/components/parameters/tradeId"
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputTrade"
 *     responses:
 *       200:
 *         description: Returns the updated trade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Trade"
 *       404:
 *         description: Trade not found
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
const updateTrade = async (ctx) => {
    checkUser(ctx);
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
 * @openapi
 * /api/trades/{id}:
 *   delete:
 *     summary: Delete a trade by id
 *     tags:
 *       - Trades
 *     parameters:
 *       - $ref: "#/components/parameters/tradeId"
 *     responses:
 *       204:
 *         description: Returns nothing if the trade was deleted
 *       404:
 *         description: Trade not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */
const deleteTrade = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.deleteById(ctx.params.tradeNr);
    ctx.status = 204;

}
deleteTrade.validationScheme = {
    params: {
        tradeNr: Joi.number().integer().positive().required(),
    }
}

// Router
module.exports = (app) => {
    const router = new Router({prefix : '/trades'});

    router.get("/", hasPermission(permissions.read), validate(getAllTrades.validationScheme), getAllTrades);
    router.get("/:tradeNr", hasPermission(permissions.read), validate(getByTradeNr.validationScheme), getByTradeNr);
    router.post("/", hasPermission(permissions.write), validate(createTrade.validationScheme), createTrade);
    router.put("/:tradeNr", hasPermission(permissions.write), validate(updateTrade.validationScheme), updateTrade);
    router.delete("/:tradeNr", hasPermission(permissions.write), validate(deleteTrade.validationScheme), deleteTrade);

    app.use(router.routes()).use(router.allowedMethods());
}
