const {tables, getKnex} = require('../data/index');
const {getLogger} = require('../core/logging');

// User exists of the following elements: userId, name, auth0Id

/**
 * Get all the users from the database
 * @returns {Promise<Array>} An array of users
*/

const findAll = async () => {
    return getKnex()(tables.user).select().orderBy('userId');
}

/**
 * Gets the user with the given id
 * @param {string} userId The id of the user
 * @returns {Promise<Object>} The user
 * @returns undefined if the user does not exist
 * @throws Error if the user could not be retrieved
 */

const findById = async (userId) => {
    try {
        return getKnex()(tables.user).select().where('userId', userId).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Gets the user with the given auth0Id
 * @param {string} auth0Id The auth0Id of the user
 * @returns {Promise<Object>} The user
 * @returns undefined if the user does not exist
 * @throws Error if the user could not be retrieved
 */

const findByAuth0Id = async (auth0Id) => {
    try {
        return getKnex()(tables.user).select().where('auth0Id', auth0Id).first();
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Creates a new user
 * @param {string} name The name of the user
 * @param {string} auth0Id The auth0Id of the user
 * @returns {Promise<Object>} The userId of the user
 * @throws Error if the user could not be created
 */

const create = async ({name, auth0Id}) => {
    try {
        await getKnex()(tables.user).insert(
            {'name': name, 
            'auth0Id': auth0Id});
        // Get the userId of the newly created user
        const user = await findByAuth0Id(auth0Id);
        return user.userId;
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Updates the user with the given id
 * @param {string} userId The id of the user
 * @param {string} name The name of the user
 * @param {string} auth0Id The auth0Id of the user
 * @returns {Promise<Object>} The userId of the user
 * @throws Error if the user could not be updated
 */

const update = async (userId, {name, auth0Id}) => {
    try {
        await getKnex()(tables.user).update(
            {'name': name,
            'auth0Id': auth0Id}).where('userId', userId);
        // Get the userId of the updated user
        return userId;
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Deletes the user with the given id
 * @param {string} userId The id of the user
 * @returns Nothing
 * @throws Error if the user could not be deleted
 */

const deleteById = async (userId) => {
    try {
        await getKnex()(tables.user).delete().where('userId', userId);
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}

/**
 * Deletes the user with the given auth0Id
 * @param {string} auth0Id The auth0Id of the user
 * @returns Nothing
 * @throws Error if the user could not be deleted
 */
const deleteByAuth0Id = async (auth0Id) => {
    try {
        await getKnex()(tables.user).delete().where('auth0Id', auth0Id);
    }
    catch (err) {
        getLogger().error(err);
        throw err;
    }
}


module.exports = {
    findAll,
    findById,
    findByAuth0Id,
    create,
    update,
    deleteById,
    deleteByAuth0Id
}
