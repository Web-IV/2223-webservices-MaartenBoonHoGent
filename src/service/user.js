const userRepo = require("../repository/user");
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');

const formatOutgoingUser = (user) => {
    // Throw ServiceError if the user does not exist
    if (!user) throw ServiceError.notFound('User does not exist');
    if (user === undefined) throw ServiceError.notFound('User does not exist');
    return {
        userId: user.userId,
        name: user.name,
        auth0Id: user.auth0Id
    };
}

const formatIncomingUser = (user) => {
    if (!user) return null;
    if (user === undefined) return null;
    return {
        name: user.name,
        auth0Id: user.auth0Id
    };
}
const debugLog = (message, meta = {}) => {
    if (!this.logger) this.logger = getLogger();
    this.logger.debug(message, meta);
};

/**
 * Findall
 * @returns All users
 * @throws Error if the users could not be retrieved
 * @throws ServiceError if the users could not be retrieved
 */

const getAll = async () => {
    debugLog('Fetching all users');
    let items = await userRepo.findAll();
    items = items.map(formatOutgoingUser);
    const count = items.length;
    return {
        items,
        count,
    };
}

/**
 * Find one user by id
 * @param {*} id
 * @returns The user if it exists
 * @throws Error if the user could not be retrieved
 */

const getById = async (id) => {
    debugLog(`Fetching user with id ${id}`);
    const user = await userRepo.findById(id);
    return formatOutgoingUser(user);
}

/**
 * Find one user by auth0Id
 * @param {*} auth0Id
 * @returns The user if it exists
 * @throws Error if the user could not be retrieved
 */

const getByAuth0Id = async (auth0Id) => {
    debugLog(`Fetching user with auth0Id ${auth0Id}`);
    const user = await userRepo.findByAuth0Id(auth0Id);
    return formatOutgoingUser(user);
}

/**
 * Create a new user
 * @param {*} user
 * @returns The created user
 * @throws Error if the user could not be created
 */

const create = async ({ name, auth0Id }) => {
    debugLog(`Creating user ${name}`);
    const newUserId = await userRepo.create({name, auth0Id});
    return await getById(newUserId);
}

/**
 * Update a user
 * @param {*} id
 * @param {*} name
 * @param {*} auth0Id
 * @returns The updated user
 * @throws Error if the user could not be updated
 */

const update = async (id, {name, auth0Id}) => {
    debugLog(`Updating user with id ${id}`);
    
    await userRepo.update(id, formatIncomingUser({name, auth0Id}));
    return await getById(id);
}

/**
 * Delete a user
 * @param {*} id
 * @returns The deleted user
 * @throws Error if the user could not be deleted
 * @throws ServiceError if the user could not be deleted
    */

const deleteById = async (id) => {
    debugLog(`Deleting user with id ${id}`);
    const user = await userRepo.getById(id);
    if (!user) return false;
    try {
        await userRepo.deleteById(id);
        return true;
    }
    catch (err) {
        throw ServiceError.internal('Could not delete user');
    }
}

const deleteByAuth0Id = async (auth0Id) => {
    debugLog(`Deleting user with auth0Id ${auth0Id}`);
    const user = await userRepo.getByAuth0Id(auth0Id);
    if (!user) return false;
    try {
        await userRepo.deleteByAuth0Id(auth0Id);
        return true;
    }
    catch (err) {
        throw ServiceError.internal('Could not delete user');
    }
}

module.exports = {
    getAll,
    getById,
    getByAuth0Id,
    create,
    update,
    deleteById,
    deleteByAuth0Id
};