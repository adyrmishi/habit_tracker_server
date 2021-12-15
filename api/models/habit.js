const { initDB } = require('../dbConfig');
const { ObjectId } = require('bson');
const defaultHabits = require('../data/defaultHabits');

class Habit {
    constructor(data){
        this.id = data.id,
        this.userEmail = data.userEmail,
        this.userName = data.userName,
        this.habitName = data.habitName;
        this.frequency = data.frequency;
        this.unit = data.unit;
        this.expectedAmount = data.expectedAmount;
        this.currentAmount = data.currentAmount;
        this.topStreak = data.topStreak;
        this.currentStreak = data.currentStreak;
        this.lastLog = data.lastLog
    };

    /**
     * Get a list of habits for a single user.
     * 
     * @param {The email of the user to retrieve the habits for} userEmail 
     * @returns A list of habits for a single user.
     */
    static findByEmail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await initDB();
                const habitData = await db.collection('habits').find({ userEmail: email }).toArray();
                const habits = habitData.map(data => new Habit({ ...data, id: data._id }));
                resolve(habits);
            } catch (err) {
                reject(`Habits couldn't be found for ${email}`);
            }
        });
    }
    
    /**
     * Get the user names and top streaks in descending order for a given habit.
     * 
     * @param {The habit name for which to retrieve the leaderboard for} habitName 
     * @returns A list of objects containing { userName, topStreak } for the given habit.
     */
    static leaderboard(habitName){
        return new Promise (async (resolve, reject) => {
            try {
                console.log(habitName);
                const db = await initDB();
                const leaderboard = await db.collection("habits").aggregate([
                    { $match: { habitName: habitName } },
                    { $sort: { topStreak: -1 } },
                    { $project: { userName: 1, topStreak: 1, _id: 0 } }
                ]).toArray();

                resolve (leaderboard);
            } catch (err) {
                reject('Error getting leaderboard');
            }
        });
    };

    /**
     * Create a new habit in the database.
     * 
     * @param {The data object from which to create a new habit, includes: 
     *         userEmail, habitName, frequency, unit, and amount} data 
     * @returns The created Habit object.
     */
    static create(data){
        return new Promise (async (resolve, reject) => {
            try {
                const { userEmail, userName, habitName, frequency, unit, amount = 1 } = data;

                console.log(data);

                const db = await initDB();
                // find and update ONLY if being inserted
                const result = await db.collection('habits').findOneAndUpdate(
                    { userEmail: userEmail, habitName: habitName },
                    { $setOnInsert: {
                        userEmail: userEmail,
                        userName: userName,
                        habitName: habitName,
                        frequency: frequency,
                        unit: unit,
                        expectedAmount: amount,
                        currentAmount: 0,
                        topStreak: 0,
                        currentStreak: 0,
                        lastLog: null
                    } },
                    { upsert: true, returnDocument: true }
                );
                // check if habit already existed 
                if (result.lastErrorObject.updatedExisting === true) {
                    reject('Habit already exists for user');
                }
                const newHabitId = result.lastErrorObject.upserted.toString();
                const newHabit = await Habit.findById(newHabitId);
                resolve (newHabit);
            } catch (err) {
                reject('Error creating habit');
            }
        });
    };

    /**
     * Find a habit of a given ID.
     * 
     * @param {The string id of the habit to find} id 
     * @returns The found Habit object.
     */
    static findById(id) {
        return new Promise (async (resolve, reject) => {
            try {
                const db = await initDB();
                const habitData = await db.collection('habits').find({ _id: ObjectId(id) }).toArray();
                const habit = new Habit({ ...habitData[0], id: habitData[0]._id.toString()});
                resolve(habit);
            } catch (err) {
                reject('Error finding habit by ID');
            }
        })
    }

    /**
     * Updates a habit with the attributes passed in. Can be used to 
     * increment the streak or to edit the habit's values.
     * 
     * @param {The data object to update the habit with} data 
     * @returns The updated Habit object.
     */
    static update(data) {
        return new Promise (async (resolve, reject) => {
            try {
                // throw error if new habit name is already a default habit
                if (defaultHabits.equals(data.newHabitName)) reject("Cannot change name of a custom habit");

                // let params = data;

                // for (let prop in params) if(!params[prop]) delete params[prop];

                // console.log(params);

                const db = await initDB();
                const updatedHabitData = await db.collection('habits').findOneAndUpdate(
                    { _id: ObjectId(data.id) },
                    { $set: { 
                        habitName: data.newHabitName,
                        frequency: data.frequency,
                        unit: data.unit,
                        expectedAmount: data.amount,
                        lastLog: data.lastLog 
                    } },
                    { returnDocument: true, new: true }
                );
                console.log(updatedHabitData);
                const updatedHabit = new Habit({ ...updatedHabitData.value, id: ObjectId(data.id) });
                resolve(updatedHabit);
            } catch (err) {
                reject('Error updating habit');
            }
        });
    }

    /**
     * Deletes the habit of the given id.
     * 
     * @param {The_id of the Habit to delete} data 
     * @returns An object containing the attributes "acknowledges" (bool) and "deletedCount" (int)
     */
    static destroy(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await initDB();
                const result = db.collection('habits').deleteOne({ _id: ObjectId(id) });
                resolve(result);
            } catch (err) {
                reject('Error deleting habit');
            }
        });
    }
}

module.exports = Habit;