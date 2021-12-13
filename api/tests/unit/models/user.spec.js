const User = require('../../../models/user');
const { initConnection } = require('../../../dbConfig');
jest.mock('mongodb');

describe('User', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await initConnection();
        db = connection.db(process.env.DB_NAME);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await resetTestDB();
    });

    // beforeEach(() => jest.clearAllMocks())

    // afterAll(() => jest.resetAllMocks())

    // describe('findByEmail', () => {
    //     test('it resolves with a user on successful db query', async () => {
    //         const db = await initDB();
    //         let userData = {userEmail: "testUser1@email.com", passwordDigest: "tester", refreshTokens: [], userName: "testerUser", habits: []}
    //         jest.spyOn(db, 'find')
    //             .mockResolvedValueOnce({rows: [ userData ]});
    //         const user = await User.findByEmail("testUser1@email.com");
    //         expect(user).toBeInstanceOf(User)
    //     })
    // })

    describe('findByEmail', () => {
        it('should resolve with a user on successful db query', async () => {
            const userData = new User({ 
                userEmail: "testUser1@email.com",
                passwordDigest: "password",
                refreshTokens: [],
                userName: "test user 1",
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
            })
            const user = await User.findByEmail("testUser1@email.com");
            expect(user).toEqual(userData)
            expect(user).toBeInstanceOf(User)
        });
    });

    describe('create', () => {
        it('resolves with a new user on successful db query', async () => {
            const data = {
                userEmail: "testUser1@email.com",
                password: "password",
                userName: "test user 1"
            }

            const user = await User.create(data);
            expect(user).toHaveProperty('userEmail');
            expect(user).toHaveProperty('passwordDigest');
            expect(user).toHaveProperty('refreshTokens');
            expect(user).toHaveProperty('userName');
            expect(user).toHaveProperty('habits');
        });
    });

    describe('update', () => {
        it('resolves with updated user on successful db query', async () => {
            const user = await User.update([
                { habitName: "Water", amount: 8 }
            ]);
            expect(user).toBeInstanceOf(User);
            expect(user.habits[0]).toEqual(objectContaining({
                "habitName": "Water",
                "frequency": 1,
                "unit": "cups",
                "amount": [{ "expected": 8 }, { "current": 8 }],
                "streak": [{ top: 5 }, { current: 4 }],
            }));
        });
    });

    describe('clearRefreshTokens', () => {
        it("resolves with expired refresh tokens being removed from a user's data", async () => {
            const result = await User.clearRefreshTokens("testUser1@email.com");
            expect(result).toBe('testUser1@email.com: expired tokens cleared');
        });
    });
})

// describe('User', () => {
//     let api;

//     beforeEach(async () => {
//         await resetTestDB();
//     });

//     beforeAll(async () => {
//         api = app.listen(5000, () => console.log('Test server running on port 5000'));
//     });

//     afterAll(async () => {
//         console.log('Gracefully stopping test server');
//         api.close(done);
//     });

//     describe('findByEmail', () => {
//         it('resolves with a user on successful db query', async () => {
//             const user = await User.findByEmail("testUser1@email.com");
//             expect(user).toBeInstanceOf(User);
//         });

//         it('resolves with an error when passed an invalid email', async () => {
//             const result = await User.findByEmail("invalid@email.com");
//             expect(result).toBe("Invalid user email");
//         });
//     });

//     describe('create', () => {
//         it('resolves with a new user on successful db query', async () => {
//             const data = {
//                 userEmail: "testUser1@email.com",
//                 password: "password",
//                 userName: "test user 1"
//             }

//             const user = await User.create(data);
//             expect(user).toHaveProperty('userEmail');
//             expect(user).toHaveProperty('passwordDigest');
//             expect(user).toHaveProperty('refreshTokens');
//             expect(user).toHaveProperty('userName');
//             expect(user).toHaveProperty('habits');
//         });
//     })

//     describe('update', () => {
//         it('resolves with updated user on successful db query', async () => {
//             const user = await User.update([
//                 { habitName: "Water", amount: 8 }
//             ]);
//             expect(user).toBeInstanceOf(User);
//             expect(user.habits[0]).toEqual(objectContaining({
//                 "habitName": "Water",
//                 "frequency": 1,
//                 "unit": "cups",
//                 "amount": [{ "expected": 8 }, { "current": 8 }],
//                 "streak": [{ top: 5 }, { current: 4 }],
//             }));
//         });
//     });

//     describe('clearRefreshTokens', () => {
//         it("resolves with expired refresh tokens being removed from a user's data", async () => {
//             const result = await User.clearRefreshTokens("testUser1@email.com");
//             expect(result).toBe('testUser1@email.com: expired tokens cleared');
//         });
//     });
// });