module.exports = {
    log: {
        level: 'silly',
        disabled: false,
    },
    database: {
		client: 'mysql2',
	},
    cors: {
        origins: ['http://localhost:3000'],
        maxAge: 3 * 60 * 60,
    },
}