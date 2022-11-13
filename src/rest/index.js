// Router
const Router = require('@koa/router');

const accountRouter = require('./_accounts');
const depositRouter = require('./_deposits');
const withdrawRouter = require('./_withdraws');
const tradeRouter = require('./_trades');
const stockRouter = require('./_stocks');

module.exports = (app) => {
    const router = new Router({ prefix: '/api' });

    accountRouter(router);
    depositRouter(router);
    withdrawRouter(router);
    tradeRouter(router);
    stockRouter(router);

    app.use(router.routes()).use(router.allowedMethods());
};