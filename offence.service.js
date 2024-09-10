const { increaseOffence, createServer, createUser } = require('./database');

const increaseUsersOffenceByOne = async (userId, userName, serverId, serverName) => {
    await createUser(userId, userName);
    await createServer(serverId, serverName);
    await increaseOffence(userId, userName, serverId, serverName);
}

module.exports = {
    increaseUsersOffenceByOne
}