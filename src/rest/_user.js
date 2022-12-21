const service = require('../service/user');
const { addUserInfo } = require('../core/auth');

/**
 * Checks the user and adds the user to the database
 * @returns Nothing if everything goes right.
 * @throws Error if connection to the database doesn't work.
 */

const checkUser = async (ctx) => {
    console.log("USING CHECKUSER");
    try {
        //console.log(ctx.state.user.sub);
        const user = await service.getByAuth0Id(ctx.state.user.sub);
    }
    catch (err) {
        // User couldn't be retrieved, create the user
        console.log('User not found, creating user');
        await addUserInfo(ctx);
        await service.create({
            name: ctx.state.user.name,
            auth0Id: ctx.state.user.sub
        });
    }
}

module.exports = {
    checkUser
}