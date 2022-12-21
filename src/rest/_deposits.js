const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/deposit');
const {hasPermission, permissions} = require('../core/auth');
const validate = require('./_validation.js');
const { checkUser } = require('./_user');

/**
 * @openapi
 * tags:
 *   name: Deposits
 *   description: Represents all operations on deposits
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     DepositsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Deposit"
 * 
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     InputDepositCreate:
 *       description: The deposit to create
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
 *                 description: The date the deposit was created
 *                 example: 1610000000
 *               "sum":
 *                 type: number
 *                 description: The sum of the deposit
 *                 example: 1000.00
 *     InputDepositUpdate:
 *       description: The deposit to update
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
 *                 description: The sum of the deposit
 *                 example: 1000.00
 */


// Deposit exists of the following elements: accountNr, date, sum, accountNr and date are primary key
// Methods: create, delete, update, find, find by accountNr, find all

/**
 * @openapi
 * /api/deposits:
 *   get:
 *    summary: Get all deposits
 *    description: Returns all deposits
 *    tags: 
 *      - Deposits
 *    responses:
 *      200:
 *        description: Returns all deposits
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/DepositsList"
 */


const getAllDeposits = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getAll();
}
getAllDeposits.validationScheme = null;

/**
 * @openapi
 * /api/deposits/{accountId}/{date}:
 *   get:
 *     summary: Get a deposit by key
 *     tags:
 *       - Deposits
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *       - $ref: "#/components/parameters/date"
 *     responses:
 *       200:
 *         description: Returns a deposit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Deposit"
 *       404:
 *         description: Deposit not found
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
 * /api/deposits:
 *   post:
 *     summary: Create a new deposit
 *     tags:
 *       - Deposits
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputDepositCreate"
 *     responses:
 *       201:
 *         description: Returns the created deposit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Deposit"
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


const createDeposit = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.create(ctx.request.body);
    ctx.status = 201;
}

createDeposit.validationScheme = {
    body: {
        accountNr : Joi.number().integer().positive().required(),
        date : Joi.date().raw().required(),
        sum : Joi.number().integer().positive().required(),
    }
}

/**
 * @openapi
 * /api/deposits/{accountId}/{date}:
 *   put:
 *     summary: Update a deposit by key
 *     tags:
 *       - Deposits
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *       - $ref: "#/components/parameters/date"
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputDepositUpdate" 
 *     responses:
 *       200:
 *         description: Returns a deposit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Deposit"
 *       404:
 *         description: Deposit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const updateDeposit = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.updateById({accountNr: ctx.params.accountNr, date: ctx.params.date}, {sum: ctx.request.body.sum});
}
updateDeposit.validationScheme = {
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
 * /api/deposits/{accountId}/{date}:
 *   delete:
 *     summary: Deletes a deposit by key
 *     tags:
 *       - Deposits
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *       - $ref: "#/components/parameters/date"
 *     responses:
 *       204:
 *         description: Returns an empty response if the deposit was deleted
 *       404:
 *         description: Deposit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const deleteDeposit = async (ctx) => {
    checkUser(ctx);
    await service.deleteById({accountNr: ctx.params.accountNr, date: ctx.params.date});
    ctx.status = 204
}
deleteDeposit.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
        date: Joi.date().raw().required(),
    }

}


// Router
module.exports = (app) => {
    const router = new Router({ prefix: '/deposits' });
    
    router.get('/', hasPermission(permissions.read), validate(getAllDeposits.validationScheme), getAllDeposits);
    router.get('/:accountNr/:date', hasPermission(permissions.read), validate(getByKey.validationScheme), getByKey);
    router.post('/', hasPermission(permissions.write), validate(createDeposit.validationScheme), createDeposit);
    router.put('/:accountNr/:date', hasPermission(permissions.write), validate(updateDeposit.validationScheme), updateDeposit);
    router.delete('/:accountNr/:date', hasPermission(permissions.write), validate(deleteDeposit.validationScheme), deleteDeposit);

    app.use(router.routes()).use(router.allowedMethods());
}