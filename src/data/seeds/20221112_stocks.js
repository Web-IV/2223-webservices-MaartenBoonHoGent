const { tables } = require("..");

module.exports = {
    seed: async (knex) => {
        // Delete   
        await knex(tables.stock).delete();
        
        // Insert
        await knex(tables.stock).insert([
            {stockId: 1, symbol: 'AAPL', name: 'Apple Inc.', 
            industry: 'Technology', sector: 'Consumer Electronics'},

            {stockId: 2, symbol: 'MSFT', name: 'Microsoft Corporation',
            industry: 'Technology', sector: 'Software'},

            {stockId: 3, symbol: 'AMZN', name: 'Amazon.com, Inc.',
            industry: 'Technology', sector: 'Internet'}
        ]);
    }
}