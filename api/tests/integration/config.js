const request = require('supertest');
const app = require('../../server');
const { initDB } = require('../../dbConfig');

function resetTestDB() {
    return new Promise(async (resolve, reject) => {
        try {
            // init connection to db
            const db = await initDB(); 
            // drop the users table
            db.collection("users").drop((err) => {
                if (err) throw err;
            })
            // insert test data
            db.users.insertMany([
                { 
                    useremail: "testUser1@email.com",
                    passwordDigest: "password",
                    habits: [
                        {
                            habitName: "Water",
                            frequency: 1,
                            unit: "cups",
                            amount: [{ expected: 8 }, { current: 0 }],
                            streak: [{ top: 5 }, { current: 3 }],
                            lastLog: "2021-12-11T11:31:21.988Z"
                        }
                    ]
                },
                { 
                    useremail: "testUser2@email.com",
                    passwordDigest: "password",
                    habits: [
                        {
                            habitName: "Walk the Dog",
                            frequency: 1,
                            unit: "times",
                            amount: [{ expected: 2 }, { current: 1 }],
                            streak: [{ top: 10 }, { current: 10 }],
                            lastLog: "2021-12-10T11:31:21.988Z"
                        }
                    ]
                },
                { 
                    useremail: "testUser3@email.com",
                    passwordDigest: "password",
                    habits: [
                        {
                            habitName: "Run",
                            frequency: 7,
                            unit: "km",
                            amount: [{ expected: 5 }, { current: 2.7 }],
                            streak: [{ top: 15 }, { current: 3 }],
                            lastLog: "2021-12-09T11:31:21.988Z"
                        }
                    ]
                },
            ])
            // close the connection to db
            db.close(); 
            resolve(`${dbName} reset for testing`);
        } catch (err) {
            reject(`Test DB could not be reset: ${err} in ${err.file}`);
        }
    });
}

global.request = request;
global.app = app;
global.resetTestDB = resetTestDB;
global.port = process.env.PORT || 5000;