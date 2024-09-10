require('./env');

const pg = require('knex') ({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        ssl: false
    }
    
})

const TABLE_NAMES = {
    user: 'User',
    server: 'Servers',
    userServerOffences: 'user_server_offences'
}

const increaseOffence = async (userId, userName, serverId, serverName) => await pg(TABLE_NAMES.userServerOffences)
    .insert({
        user_id: userId,
        server_id: serverId,
        num_offences: 1
    })
    .onConflict(['user_id', 'server_id'])
    .merge({
        num_offences: pg.raw('user_server_offences.num_offences + 1')
    })
    .returning('num_offences')
    .then(([{ num_offences }]) => num_offences);


const createUser = async (userId, userName) => await pg(TABLE_NAMES.user)
    .insert({
        id: userId,
        user_name: userName
    }).onConflict('id')
    .ignore();


const createServer = async (serverId, serverName) => await pg(TABLE_NAMES.server)
    .insert({
        id: serverId,
        server_name: serverName
    }).onConflict('id')
    .ignore();

const clearOffences = async (userId, serverId) => await pg(TABLE_NAMES.userServerOffences)
    .where({
        user_id: userId,
        server_id: serverId
    })
    .update({
        num_offences: 0
    });


module.exports = {
    increaseOffence,
    createServer,
    createUser
}