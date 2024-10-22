const mysql = require('mysql');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`

const DB = isProduction ? mysql.createConnection(urlDB) : mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
// Function to test connection (no need to call .connect())
const connectDB = () => {
    try {
        // Query to check the connection
        DB.query('SELECT 1', (err, results) => {
            if (err) {
                console.log("Something went wrong while connecting to the DB!!", err);
                return;
            }
            console.log("DB connected successfully!!");
        });
    } catch (error) {
        console.log("Error while connecting to DB", error);
    }
};

module.exports = {
    connectDB: connectDB,
    DB: DB
};
