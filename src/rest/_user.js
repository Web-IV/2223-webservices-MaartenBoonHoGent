const service = require('../service/user');

/**
 * Checks the user and adds the user to the database
 * @returns Nothing if everything goes right.
 * @throws Error if connection to the database doesn't work.
 */

const checkUser = async (ctx) => {
    try {
        const user = await service.getByAuth0Id(ctx.state.user.sub);
    }
    catch (err) {
        // User couldn't be retrieved, create the user
        await service.create({
            name: ctx.state.user.name,
            auth0Id: ctx.state.user.sub
        });
    }
}

module.exports = {
    checkUser
}