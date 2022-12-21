const Router = require('@koa/router');

const healthService = require('../service/health');
const {hasPermission, permissions} = require('../core/auth');
const { checkUser } = require('./_user');
const validate = require('./_validation');

const ping = async (ctx) => {
  checkUser(ctx);
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

const getVersion = async (ctx) => {
  checkUser(ctx);
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;

/**
 * Install health routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installPlacesRoutes(app) {
  const router = new Router({
    prefix: '/health',
  });

  router.get('/ping', hasPermission(permissions.read), validate(ping.validationScheme), ping);
  router.get('/version', hasPermission(permissions.read), validate(getVersion.validationScheme), getVersion);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
