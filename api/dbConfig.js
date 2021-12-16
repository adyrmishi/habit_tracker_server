const { MongoClient } = require('mongodb');

const dbUrl = process.env.DB_CONNECTION; // connection url
const dbName = process.env.DB_NAME; // db name

// Create a new MongoClient
const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });   

async function initConnection() {
    // Connect the client to the server
    console.log('connected to mongo');
    await client.connect();
}

async function initDB() {
    console.log(`connected to database ${dbName}`);
    return client.db(dbName);
}

module.exports = { 
    initDB,
    initConnection
};