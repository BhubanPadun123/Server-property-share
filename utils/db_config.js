const mysql = require('mysql');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
let DB = null;

// Use a single pool for both production and development environments
const urlDB = `mysql://root:${process.env.MYSQLPASSWORD}@mysql.railway.internal:3306/railway`
if (isProduction) {
    // DB = mysql.createPool({
    //     host: process.env.MYSQLHOST,
    //     port: process.env.MYSQLPORT,
    //     user: process.env.MYSQLUSER,
    //     password: process.env.MYSQLPASSWORD,
    //     database: process.env.MYSQLDATABASE // Use the correct database variable for production
    // });
    DB = mysql.createConnection(urlDB);
} else {
    DB = mysql.createPool({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

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
