const Koa = require('koa');
const koaCors = require('@koa/cors');
const router = require('@koa/router');


const config = require('config');
const stockService = require('./service/stock');
const { getLogger } = require('./core/logging')

const { initializeData } = require('./data');


const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');


async function main() {
	const logger = getLogger();
	
	await initializeData();

	console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`)

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


	const router = new Router();

	router.get("/api/stocks", async(ctx) => {
		logger.info(JSON.stringify(ctx.request));
		ctx.body = stockService.getAll();
	});

	router.post("/api/stocks", async(ctx) => {
		ctx.body = stockService.create({...ctx.request.body});;
	});

	router.get("/api/stocks/:id", async(ctx) => {
		ctx.body = stockService.getById(ctx.params.id);
	});



	app.use(router.routes());
	app.use(router.allowedMethods());


	logger.info(`🚀 Server listening on http://localhost:9000`);
	app.listen(9000);
		

}
main();
