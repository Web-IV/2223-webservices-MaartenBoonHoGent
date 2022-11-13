const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');


const config = require('config');
const { getLogger, initializeLogger } = require('./core/logging')

const installRest = require('./rest');
const { initializeData, shutdown } = require('./data');


const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');
// function createServer 

module.exports = async function createServer () {
    // Start with the logger
	initializeLogger({
		level: LOG_LEVEL,
		disabled: LOG_DISABLED,
		defaultMeta: { NODE_ENV },
	  });
	const logger = getLogger();
	
    // Initialize the database
	await initializeData();

	console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`)

    // CORS
    const app = new Koa();
	app.use(
		koaCors({
			origin: (ctx) => {
				if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
					return ctx.request.header.origin;
				}
				return CORS_ORIGINS[0];
			},
			allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
			maxAge: CORS_MAX_AGE,
		})
	);

    app.use(bodyParser())

    installRest(app);

    return {
        getApp() { return app; },
        start() {
            return new Promise(resolve => {
                const port = config.get('port');
                app.listen(port);
                logger.info(`🚀 Server listening on http://localhost:${port}`);
                resolve();
            });
        },
        async stop() {
            {
                app.removeAllListeners();
                await shutdown();
                getLogger().info('👋 Server stopped');
            }
        }
    }
};