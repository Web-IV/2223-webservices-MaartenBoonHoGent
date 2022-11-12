const { tables } = require("..");

module.exports = {
    seed: async (knex) => {
        // Delete   
        await knex(tables.stock).delete();
        
        // Insert
        await knex(tables.stock).insert([
            {stockId: 1, symbol: 'AAPL', name: 'Apple Inc.', 
            industry: 'Technology', sector: 'Consumer Electronics', 
            'IPO date': '1980-12-12', 'date of incorporation': '1976-04-01'},

            {stockId: 2, symbol: 'MSFT', name: 'Microsoft Corporation',
            industry: 'Technology', sector: 'Software',
            'IPO date': '1986-03-13', 'date of incorporation': '1975-04-04'},

            {stockId: 3, symbol: 'AMZN', name: 'Amazon.com, Inc.',
            industry: 'Technology', sector: 'Internet',
            'IPO date': '1997-05-15', 'date of incorporation': '1994-07-05'}
        ]);
    }
}