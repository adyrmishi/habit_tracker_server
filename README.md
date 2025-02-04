﻿# habit_tracker_server
 
 ## Description
 Development code for the Habit Tracker website server. Consists of three main parts: Authorization, Users, and Habits. Authorization allows Users to register and login, with  passwords encrypted and stored in a MongoDB database using bcrypt. JsonWebToken is used to process users with access to perform various CRUD operations on their Habits data. Refresh and Access tokens are uses so that access to these operations is temporary (20 minute timer) and they have to request another access token to continue said operations.
 
 ## Installation 
* Clone the repo into your desired directory.
* Open a bash terminal in the cloned repo and navigate to root of the directory.
* Execute the command `bash _scripts/startDev.sh` to run the development Docker containers. This will install npm dependancies and run the server using Nodemon.

## Usage
Included in the repo the request.rest file that can be used with the VSCode extension downloaded: REST Client by Huachao Mao. This sends http requests to http://localhost:3000 where the development server is running.

In order to properly use the server on your localhost, a .env file needs to be created in the /api folder, with the environment variables ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET created. These secrets can be anything, or you can make one quickly using the node terminal: type `node` in a terminal (Node.js must be installed). Then type `require('crypto').randomBytes(64).toString('hex')` to get 64 random bytes converted to a hexadecimal string.

The following routes are available to send http requests to:
* http://localhost:3000/users/ - GETs all users.
* http://localhost:3000/users/:email - GETs a specific user by email.
* http://localhost:3000/auth/register - POSTs a new user to the database. Requires the following variables in the request body: "email", "password", "userName".
* http://localhost:3000/auth/login - POSTs a login request to the database. Upon successful "email" and "password" input in the request body, a new "accessToken" and "refreshToken" is sent to the client. The access token has a time limit of 20 minutes until it will be invalid.
* http://localhost:3000/auth/token - POSTs a refresh token request to the datase. Requires "email" and "token" (refreshToken obtained from previous login) and sends back a new access token.
* http://localhost:3000/auth/logout - POSTs a logout request to the database. Requires "email" of the user to be logged out as well as their (refresh) "token" that will be removed from their document in the database and no longer valid to obtain more access tokens.

The following routes will require an access token passed in as "authorization" in the request headers:
* http://localhost:3000/habits/:email - GETs a list of Habit objects for the given user email. 
* http://localhost:3000/habits/leaderboard/:habitName - GETs a leaderboard for a given habit. 
* http://localhost:3000/habits/:email - POSTs a new habit to the database for the given user email.
* http://localhost:3000/habits/:id - PUTs updated values for an existing habit into the database.
* http://localhost:3000/habits/:id - DELETEs a habit from the database.
