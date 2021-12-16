const { initDB } = require("../dbConfig")

module.exports = class User {
    constructor(data) {
        this.userEmail = data.userEmail
        this.passwordDigest = data.passwordDigest
        this.userName = data.userName
        this.refreshTokens = data.refreshTokens
    }

    static get all () {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const result = await db.collection('users').find().toArray();
                const users = result.map(user => new User({ ...user }));
                res(users);
            } catch (err) {
                rej('Error retrieving all users')
            }
        });
    }

    static findByEmail (email) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                let result = await db.collection('users').find({ userEmail: email }).toArray();
                let user = new User(result[0]);
                res(user);
            } catch (err) {
                rej(`Error finding user by email: ${err}`);
            }
        })
    }

    static create (userData) {
        return new Promise (async (res, rej) => {
            try {
                const { userEmail, passwordDigest, userName, refreshTokens = [] } = userData;
                // check for empty or null email/password/usernames
                if (userEmail === (null || "") || passwordDigest === (null || "") || userName === (null || "")) {
                    throw new Error('Fields cannot be null or empty');
                }

                const db = await initDB();
                // find and update ONLY if being inserted
                const result = await db.collection('users').findOneAndUpdate(
                    { userEmail: userEmail },
                    { $setOnInsert: { userEmail: userEmail, passwordDigest: passwordDigest, userName: userName, refreshTokens:refreshTokens } },
                    { upsert: true, returnDocument: "after" }
                );
                // check if user already exists
                if (result.lastErrorObject.updatedExisting === true) {
                    rej('Error: User already exists');
                }

                res(result.value);
            } catch (err) {
                rej(`Error creating user: ${err}`);
            }
        })
    }

    static clearRefreshTokens (email, token) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const clearedUser = await db.collection('users').updateOne(
                    { userEmail: email },
                    { $pull: { refreshTokens: token } }
                );
                res(clearedUser);
            } catch (err) {
                rej(`Error clearing access token for user ${email}: ${err}`)
            }
        })
    }

    static pushToken (email, token) {
        return new Promise (async (res, rej) => {
            try {
                const db = await initDB();
                const result = db.collection('users').updateOne(
                    { userEmail: email }, 
                    { $push: { refreshTokens: token } }
                );
                res(result);
            } catch (err) {
                rej(`Error pushing access token for user ${email}: ${err}`);
            }
        })
    }
}
