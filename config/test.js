module.exports = {
  log: {
      level: 'silly',
      disabled: true // Disable logging for testing,
  },
  database: {
  client: 'mysql2',
  host: 'localhost',
  port: 3306,
  name: 'budget_test',
},
  cors: {
      origins: ['http://localhost:3000'],
      maxAge: 3 * 60 * 60,
  },
}