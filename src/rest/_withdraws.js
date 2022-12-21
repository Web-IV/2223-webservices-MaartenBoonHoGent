const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/withdraw');
const {hasPermission, permissions} = require('../core/auth');
const validate = require('./_validation.js');
const { checkUser } = require('./_user');

/**
 * @openapi
 * tags:
 *   name: Withdraws
 *   description: Represents all operations on withdraws
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     WithdrawsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Withdraw"
 * 
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     InputWithdrawCreate:
 *       description: The withdraw to create
 *       required: True
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - "accountNr"
 *               - "date"
 *               - "sum"
 *             properties:
 *               "accountNr":
 *                 type: integer
 *                 description: The account number of the account
 *                 example: 1
 *               "date":
 *                 type: integer
 *                 format: date in the format of a timestamp (seconds since epoch)
 *                 description: The date the withdraw was created
 *                 example: 1610000000
 *               "sum":
 *                 type: number
 *                 description: The sum of the withdraw
 *                 example: 1000.00
 *     InputWithdrawUpdate:
 *       description: The withdraw to update
 *       required: True
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - "sum"
 *             properties:
 *               "sum":
 *                 type: number
 *                 description: The sum of the withdraw
 *                 example: 1000.00
 */


// Withdraw exists of the following elements: accountNr, date, sum, accountNr and date are primary key
// Methods: create, delete, update, find, find by accountNr, find all

/**
 * @openapi
 * /api/withdraws:
 *   get:
 *    summary: Get all withdraws
 *    description: Returns all withdraws
 *    tags: 
 *      - Withdraws
 *    responses:
 *      200:
 *        description: Returns all withdraws
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/WithdrawsList"
 */


const getAllWithdraws = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getAll();
}
getAllWithdraws.validationScheme = null;

/**
 * @openapi
 * /api/withdraws/{accountId}/{date}:
 *   get:
 *     summary: Get a withdraw by key
 *     tags:
 *       - Withdraws
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *       - $ref: "#/components/parameters/date"
 *     responses:
 *       200:
 *         description: Returns a withdraw
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Withdraw"
 *       404:
 *         description: Withdraw not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const getByKey = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getById({accountNr: ctx.params.accountNr, date: ctx.params.date});
}
getByKey.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().raw().required(),
    }
}

/**
 * @openapi
 * /api/withdraws:
 *   post:
 *     summary: Create a new withdraw
 *     tags:
 *       - Withdraws
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputWithdrawCreate"
 *     responses:
 *       201:
 *         description: Returns the created withdraw
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Withdraw"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/400ValidationError"
 *       409:
 *         description: The given accountNr does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/409Conflict"
 */


const createWithdraw = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.create(ctx.request.body);
    ctx.status = 201;
}

createWithdraw.validationScheme = {
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().raw().required(),
        sum : Joi.number().integer().positive().required(),
    }
}

/**
 * @openapi
 * /api/withdraws/{accountId}/{date}:
 *   put:
 *     summary: Update a withdraw by key
 *     tags:
 *       - Withdraws
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *       - $ref: "#/components/parameters/date"
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputWithdrawUpdate" 
 *     responses:
 *       200:
 *         description: Returns a withdraw
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Withdraw"
 *       404:
 *         description: Withdraw not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const updateWithdraw = async (ctx) => {
    checkUser(ctx);
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
 * @openapi
 * /api/withdraws/{accountId}/{date}:
 *   delete:
 *     summary: Deletes a withdraw by key
 *     tags:
 *       - Withdraws
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *       - $ref: "#/components/parameters/date"
 *     responses:
 *       204:
 *         description: Returns an empty response if the withdraw was deleted
 *       404:
 *         description: Withdraw not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const deleteWithdraw = async (ctx) => {
    checkUser(ctx);
    await service.deleteById({accountNr: ctx.params.accountNr, date: ctx.params.date});
    ctx.status = 204
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
    
    router.get('/', hasPermission(permissions.read), validate(getAllWithdraws.validationScheme), getAllWithdraws);
    router.get('/:accountNr/:date', hasPermission(permissions.read), validate(getByKey.validationScheme), getByKey);
    router.post('/', hasPermission(permissions.write), validate(createWithdraw.validationScheme), createWithdraw);
    router.put('/:accountNr/:date', hasPermission(permissions.write), validate(updateWithdraw.validationScheme), updateWithdraw);
    router.delete('/:accountNr/:date', hasPermission(permissions.write), validate(deleteWithdraw.validationScheme), deleteWithdraw);

    app.use(router.routes()).use(router.allowedMethods());
}