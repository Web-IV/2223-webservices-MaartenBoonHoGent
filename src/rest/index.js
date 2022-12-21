// Router
const Router = require('@koa/router');

const accountRouter = require('./_accounts');
const depositRouter = require('./_deposits');
const withdrawRouter = require('./_withdraws');
const tradeRouter = require('./_trades');
const stockRouter = require('./_stocks');
const healthRouter = require('./_health');

// DepositId exists of two parts: accountId and date, so we need to split it
/**
 * @openapi
 * components:
 *   schemas:
 *     ListResponse:
 *       required:
 *         - count
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of items returned
 *           example: 1
 *     Account:
 *       required:
 *         - "accountNr"
 *         - "e-mail"
 *         - "date joined"
 *         - "invested sum"
 *       properties:
 *         "accountNr":
 *            type: integer
 *            format: int64
 *            description: The account number, unique identifier
 *            example: 1
 *         "e-mail":
 *            type: string
 *            description: The e-mail address of the account
 *            example: 'test@gmail.com'
 *         "date joined":
 *            type: integer
 *            format: date in the format of a timestamp (seconds since epoch)
 *            description: The date the account was created
 *            example: 1610000000
 *         "invested sum":
 *            type: number
 *            description: The amount of money invested in the account
 *            example: 1000
 *     Stock:
 *       required:
 *         - "stockId"
 *         - "symbol"
 *         - "name"
 *         - "industry"
 *         - "sector"
 *       properties:
 *         "stockId":
 *           type: integer
 *           format: int64
 *           description: The stock id, unique identifier
 *           example: 1
 *         "symbol":
 *           type: string
 *           description: The ticker / symbol of the stock
 *           example: "AAPL"
 *         "name":
 *           type: string
 *           description: The name of the stock
 *           example: "Apple Inc."
 *         "industry":
 *           type: string
 *           description: The industry of the stock
 *           example: "Technology"
 *         "sector":
 *           type: string
 *           description: The sector of the stock
 *           example: "Consumer Electronics"
 *     Trade:
 *       required:
 *         - "tradeId"
 *         - "stock"
 *         - "price bought"
 *         - "price sold"
 *         - "date bought"
 *         - "date sold"
 *         - "amount"
 *         - "comment bought"
 *         - "comment sold"
 *       properties:
 *         "tradeId":
 *           type: integer
 *           format: int64
 *           description: The trade id, unique identifier
 *           example: 1
 *         "stock":
 *           $ref: "#/components/schemas/Stock"
 *         "price bought":
 *           type: number
 *           description: The price the stock was bought at
 *           example: 100.00
 *         "price sold":
 *           type: number
 *           description: The price the stock was sold at
 *           example: 101.00
 *         "date bought":
 *           type: integer
 *           format: date in the format of a timestamp (seconds since epoch)
 *           description: The date the trade was started
 *           example: 1610000000
 *         "date sold":
 *           type: integer
 *           format: date in the format of a timestamp (seconds since epoch)
 *           description: The date the trade was ended
 *           example: 1610005000
 *         "amount":
 *           type: integer
 *           format: int64
 *           description: The amount of stocks bought
 *           example: 10
 *        "comment bought":
 *           type: string
 *           description: The comment for the buy order
 *           example: "Buy at 100"
 *        "comment sold":
 *           type: string
 *           description: The comment for the sell order
 *           example: "Sell at 100"
 * 
 * 
 * 
 */


/**
 * @openapi
 * components:
 *   parameters:
 *      accountId:
 *         in: path
 *         name: accountId
 *         description: The account id to get, update or delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         example: 1
 *      date:
 *         in: path
 *         name: date
 *         description: The date, in the format of a timestamp (seconds since epoch)
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         example: 1610000000
 *      tradeId:
 *         in: path
 *         name: tradeId
 *         description: The trade id to get, update or delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         example: 5
 *      stockId:
 *         in: path
 *         name: stockId
 *         description: The stock id to get, update or delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         example: 6
 *      stockSymbol:
 *        in: path
 *        name: stockSymbol
 *        description: The ticker / symbol of the stock to get, update or delete
 *        required: true
 *        schema:
 *          type: string
 *        example: AAPL
 *      accountMail:
 *        in: path
 *        name: e-mail
 *        description: The e-mail address of the account to get, update or delete
 *        required: true
 *        schema:
 *          type: string
 *        example:
 *          'test@gmail.com'
 */

/**
 * @openapi
 * components:
 *   responses:
 *     400ValidationError:
 *       description: Validation error, the request body or parameter is not valid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "VALIDATION_ERROR"
 *             details: "The request body or parameter is not valid"
 *     401Unauthorized:
 *       description: The user is not authorized to access the resource
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "NOT_AUTHORIZED"
 *             details: "You are not authorized to access this resource"
 *     403Forbidden:
 *       description: The user is not allowed to access the resource
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "NOT_ALLOWED"
 *             details: "Not allowed to access this resource"
 *     404NotFound:
 *       description: The request resource could not be found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "NOT_FOUND"
 *             details: "No stock with the symbol THISDOESNOTEXIST exists"
 *     409Conflict:
 *       description: There is a conflict with the current state of the resource and the request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "CONFLICT"
 *             details: "The account already has a deposit with the date 1610000000"
 *     500ServerError:
 *       description: Something went wrong on the server
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information about the specific error that occured
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *           example:
 *             code: "INTERNAL_SERVER_ERROR"
 *             details: "Internal server error"
*/

module.exports = (app) => {
    const router = new Router({ prefix: '/api' });

    accountRouter(router);
    depositRouter(router);
    withdrawRouter(router);
    tradeRouter(router);
    stockRouter(router);
    healthRouter(router);

    app.use(router.routes()).use(router.allowedMethods());
};