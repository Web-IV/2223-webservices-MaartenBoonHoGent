const config = require("config");
const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');
const { join } = require('path');
const { getLogger } = require('../core/logging');

const knex = require('knex');

let knexInstance;

async function initializeData() {
	const knexOptions = {
		client: DATABASE_CLIENT,
		connection: {
			host: DATABASE_HOST,
			port: DATABASE_PORT,
			//database: DATABASE_NAME,
			user: DATABASE_USERNAME,
			password: DATABASE_PASSWORD,
			insecureAuth: isDevelopment,
		},
		
		migrations: {
			directory: join('src', 'data', 'migrations'),
			tableName: 'knex_migrations',
		},

		seeds: {
			directory: join('src', 'data', 'seeds'),
		},
    }

	// Initialize Knex

    knexInstance = knex(knexOptions);

    const logger = getLogger();

	// Database test
	try {
		await knexInstance.raw('SELECT 1+1 AS result');
		await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
		await knexInstance.destroy();

    	knexOptions.connection.database = DATABASE_NAME;
    	knexInstance = knex(knexOptions);
	    await knexInstance.raw('SELECT 1+1 AS result');

	} catch (error) {
		logger.error(error.message, { error });
		throw new Error('Could not initialize the data layer');
	}

	// Migrations
	let migrationsFailed = false;

	try {
		await knexInstance.migrate.latest();
	} catch (error) {
		logger.error('Error while migrating: ' + error.message, { error });
		//throw new Error('Could not run the migrations');
		migrationsFailed = true;
	}

	if (migrationsFailed) {
		try  {
			// Bring the instance down
			await knexInstance.migrate.down();
		} catch (error) {
			logger.error('Error while rolling back migrations: ' + error.message, { error });
			throw new Error('Could not roll back the migrations');
		}
	}

	// Seeds
	if (isDevelopment) {
		try {
			await knexInstance.seed.run();
		} catch (error) {
			logger.error('Error while seeding: ' + error.message, { error });
			throw new Error('Could not run the seeds');
		}
	}
	logger.info('Succesfully connected to the database');
    return knexInstance;
};

// Shutdown
async function shutdown() {
	if (knexInstance) {
		const logger = getLogger();
		logger.info('Attempting to shut down connection to the database');

		await knexInstance.destroy();
		knexInstance = null;

		logger.info('Connection to the database shut down');
	}
}


function getKnex() {
	if (!knexInstance) throw new Error('Please initialize the data layer before getting the Knex instance');
	return knexInstance;
}

const tables = Object.freeze({
    stock: 'Stock',
    withdraw: 'Withdraw',
    deposit: 'Deposit',
    account: 'Account',
    trade: 'Trade',
	user: 'User',
});
	
module.exports = {
	tables,
	initializeData,
    getKnex,
	shutdown,
};