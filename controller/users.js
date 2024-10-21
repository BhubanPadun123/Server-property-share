const jwt = require("jsonwebtoken");
const redis = require("redis");
const LOGGR = require('pino')();
const CLOG = LOGGR.child({ type: 'USER_CTRL' });
const { DB } = require('../utils/db_config')
// const redisClient = redis.createClient("6379", "127.0.0.1");
const secretKey = "9387b563b8018b29d88450e1c18008edc6086cfb";
const bcrypt = require('bcrypt')

const getUserDetails = function (userName) {
	return new Promise(function (resolve, reject) {
		try {
			DB.query(`SELECT * FROM users WHERE email = '${userName}'`, (err, results, fields) => {
				if (err) {
					console.error('Error retrieving user: ' + err.stack);
					CLOG.error(`User Details not found for ${userName}`);
					reject({ message: `User Details not found for ${userName}`, statusCode: 404 });
					return; // Added return to exit the function after rejection
				}

				if (results && results.length > 0) {
					resolve({ results, fields }); // Resolve with results and fields
				} else {
					CLOG.error(`User Details not found for ${userName}`);
					reject({ message: `User Details not found for ${userName}`, statusCode: 404 });
				}
			});
		} catch (error) {
			console.error("Error-->", error);
			CLOG.error(`Error establishing DB connection - ${error}`);
			reject({ message: "Internal db service error", statusCode: 500 });
		}
	});
};

// Function to authenticate user
const authenticateUser = function (userName, password) {
	return new Promise(function (resolve, reject) {
		getUserDetails(userName).then(function (userDetails) {
			bcrypt.compare(password, userDetails.results[0].password).then((result) => {
				if (result) {
					resolve({ "userName": userName, userid: userDetails.results[0] });
				} else {
					reject({ "message": `Password incorrect!!`, "statusCode": 404 })
				}
			}).catch(e => {
				reject({ "message": `Error ${e}`, "statusCode": 404 })
			})

		}).catch(function (error) {
			reject(error);
		});
	});
};

// Function to Expire the token
let expireToken = function (userName, token) {
	return new Promise(function (resolve, reject) {
		token = token.split(" ")[1].trim();

		// Verify the token
		jwt.verify(token, secretKey, function (err, tokenInfo) {
			if (err) {
				reject({ "message": "Unauthorized user", "statusCode": 401 });
				return;
			}

			if (userName !== tokenInfo.userName) {
				reject({ "message": "Unauthorized user", "statusCode": 401 });
				return;
			}

			// Delete the token info from temp storage
			// redisClient.del("US:" + tokenInfo.sessionId, function () {
			// 	resolve({"message": "User token expired"});
			// });
		});
	});
};

// Function to check if the token is valid or not
let isValidToken = function (token) {
	return new Promise(function (resolve, reject) {

		token = token.split("=")[1].trim();

		jwt.verify(token, secretKey, function (err, tokenInfo) {
			if (err) {
				reject({ "message": "Unauthorized user", "statusCode": 401 });
				return;
			}
			if (tokenInfo) {
				resolve({
					"message": "User Login successfull",
					"statusCode": 200
				})
			}

			// Check If the session Id is available in REDIS, If not available the session is expired
			redisClient.get("US:" + tokenInfo.sessionId, function (error, reply) {
				if (error) {
					reject({ "message": "Unauthorized user", "statusCode": 401 });
					return;
				}

				if (reply) {
					resolve({});
					return;
				}

				reject({ "message": "Unauthorized user", "statusCode": 401 });
			});
		});
	});
};


const createNewUser = function (userName, password, email, userData, userRole) {
	return new Promise(async function (resolve, reject) {
		try {
			const saltRounds = 10;
			let hasPassword = await bcrypt.hash(password, saltRounds);
			if (hasPassword != null) {
				const userDataToUpdate = {
					userName: userName,
					password: hasPassword,
					email: email,
					userRole: JSON.stringify(userRole),
					userData: JSON.stringify(userData)
				}
				console.log(userDataToUpdate,"<<<<<<")
				DB.query(`INSERT INTO users SET ?`, userDataToUpdate, (err, results) => {
					if (err) {						
						reject({ message: "Something went wrong while insert user", err, statusCode: 500 })
					}
					if (results) {
						resolve({ results })
					}
				})
			} else {
				reject({ message: "Something went wrong!!", statusCode: 402 })
			}
		} catch (error) {
			reject({ message: "user Register failed!!" + error, statusCode: 500 })
		}
	});
};

module.exports = {
	authenticateUser: authenticateUser,
	expireToken: expireToken,
	isValidToken: isValidToken,
	createNewUser: createNewUser
};