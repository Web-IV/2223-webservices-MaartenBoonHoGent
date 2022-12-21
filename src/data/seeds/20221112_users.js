const { tables } = require("..");

module.exports = {
    seed: async (knex) => {
        // Delete   
        await knex(tables.user).delete();
        
        // Insert
        await knex(tables.user).insert([
            {userId: 1, name: 'John Doe', auth0Id: 'auth0|60f7b1b1b1b1b1b1b1b1b1b1'},
            {userId: 2, name: 'Jane Doe', auth0Id: 'auth0|60f7b1b1b1b1b1b1b1b1b1b2'}
        ]);
    }
}