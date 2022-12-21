const Joi = require('joi');
const Router = require('@koa/router');

const service = require('../service/account');
const validate = require('./_validation.js');
const {hasPermission, permissions} = require('../core/auth');
const { checkUser } = require('./_user');

/**
 * @openapi
 * tags:
 *   name: Accounts
 *   description: Represents all operations on accounts
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AccountsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Account"
 * 
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     InputAccount:
 *       description: The account to create or update
 *       required: True
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - "e-mail"
 *               - "date joined"
 *               - "invested sum"
 *             properties:
 *               "e-mail":
 *                 type: string
 *                 description: The e-mail address of the account
 *                 example: 'test@gmail.com'
 *               "date joined":
 *                 type: integer
 *                 format: date in the format of a timestamp (seconds since epoch)
 *                 description: The date the account was created
 *                 example: 1610000000
 *               "invested sum":
 *                 type: integer
 *                 description: The amount of money invested in the account
 *                 example: 1000
 */

const formatInput = (ctx) => {
    return {
        eMail: ctx.request.body["e-mail"],
        dateJoined: ctx.request.body["date joined"],
        investedSum: ctx.request.body["invested sum"]
    }
}

/**
 * @openapi
 * /api/accounts:
 *   get:
 *    summary: Get all accounts
 *    description: Returns all accounts
 *    tags: 
 *      - Accounts
 *    responses:
 *      200:
 *        description: Returns all accounts
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/AccountsList"
 */

const getAllAccounts = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getAll();
};
getAllAccounts.validationScheme = null;

/**
 * @openapi
 * /api/accounts/{id}:
 *   get:
 *     summary: Get an account by id
 *     tags:
 *       - Accounts
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *     responses:
 *       200:
 *         description: Returns an account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Account"
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const getAccountById = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getById(ctx.params.accountNr);
}
getAccountById.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}


/**
 * @openapi
 * /api/accounts/e-mail/{e-mail}:
 *   get:
 *     summary: Get an account by e-mail
 *     tags:
 *       - Accounts
 *     parameters:
 *       - $ref: "#/components/parameters/accountMail"
 *     responses:
 *       200:
 *         description: Returns an account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Account"
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */
const getAccountByEmail = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.getByEmail(ctx.params.email);
}
getAccountByEmail.validationScheme = {
    params: {
        email: Joi.string().email().required(),
    }
}

/**
 * @openapi
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags:
 *       - Accounts
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputAccount"
 *     responses:
 *       201:
 *         description: Returns the created account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Account"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/400ValidationError"
 *       409:
 *         description: The account already exists with the given e-mail address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/409Conflict"
 */

const createAccount = async (ctx) => {
    checkUser(ctx);
    let response = await service.create(formatInput(ctx));
    ctx.body = response;
    ctx.status = 201;
    
}
createAccount.validationScheme = {
    body: {
        "e-mail": Joi.string().email().required(),
        "date joined": Joi.date().raw().required(),
        "invested sum": Joi.number().required(),
    }
}

/**
 * @openapi
 * /api/accounts/{id}:
 *   put:
 *     summary: Update an account
 *     tags:
 *       - Accounts
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *     requestBody:
 *       $ref: "#/components/requestBodies/InputAccount"
 *     responses:
 *       200:
 *         description: Returns the updated account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Account"
 *       404:
 *         description: Account not found
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
const updateAccount = async (ctx) => {
    checkUser(ctx);
    ctx.body = await service.updateById(ctx.params.accountNr, formatInput(ctx));
}
updateAccount.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    },
    body: {
        "e-mail" : Joi.string().email().required(),
        "date joined" : Joi.date().required(),
        "invested sum" : Joi.number().integer().positive().required(),
    }
}

/**
 * @openapi
 * /api/accounts/{id}:
 *   delete:
 *     summary: Delete an account by id
 *     tags:
 *       - Accounts
 *     parameters:
 *       - $ref: "#/components/parameters/accountId"
 *     responses:
 *       204:
 *         description: Returns nothing if the account was deleted
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/404NotFound"
 */

const deleteAccount = async (ctx) => {
    checkUser(ctx);
    await service.deleteById(ctx.params.accountNr);
    ctx.status = 204
}
deleteAccount.validationScheme = {
    params: {
        accountNr: Joi.number().integer().positive().required(),
    }
}

// Export router
module.exports = (app) => {
    const router = new Router({ prefix: '/accounts' });

    router.get('/', hasPermission(permissions.read), validate(getAllAccounts.validationScheme), getAllAccounts);
    router.get('/:accountNr', hasPermission(permissions.read), validate(getAccountById.validationScheme), getAccountById);
    router.get('/e-mail/:email', hasPermission(permissions.read), validate(getAccountByEmail.validationScheme), getAccountByEmail);
    router.post('/', hasPermission(permissions.write), validate(createAccount.validationScheme), createAccount);
    router.put('/:accountNr', hasPermission(permissions.write), validate(updateAccount.validationScheme), updateAccount);
    router.delete('/:accountNr', hasPermission(permissions.write), validate(deleteAccount.validationScheme), deleteAccount);
    
    app.use(router.routes()).use(router.allowedMethods());
};