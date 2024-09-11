const { increaseOffence, createServer, createUser } = require('./database');

const increaseUsersOffenceByOne = async (userId, userName, serverId, serverName) => {
    await createUser(userId, userName);
    await createServer(serverId, serverName);
    return await increaseOffence(userId, userName, serverId, serverName);
}

module.exports = {
    increaseUsersOffenceByOne
}