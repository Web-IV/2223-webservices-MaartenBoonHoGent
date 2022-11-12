// Router
const Router = require('@koa/router');

const accountRouter = require('./_account');
const depositRouter = require('./_deposits');
const withdrawRouter = require('./_withdraw');
const tradeRouter = require('./_trade');
const stockRouter = require('./_stock');

module.exports = (app) => {
    const router = new Router({ prefix: '/api' });

    accountRouter(router);
    depositRouter(router);
    withdrawRouter(router);
    tradeRouter(router);
    stockRouter(router);

    app.use(router.routes()).use(router.allowedMethods());
};