const mysql = require('mysql')
require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production';
let DB_POOL = null
if (isProduction) {
    DB_POOL = mysql.createPool({
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQL_ROOT_PASSWORD
    })
} else {
    DB_POOL = mysql.createPool({
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })
}

let DB = null
if (isProduction) {
    DB = mysql.createPool({
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQL_ROOT_PASSWORD
    })
} else {
    DB = mysql.createConnection({
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })
}

const connectDB = () => {
    try {
        DB.connect((err) => {
            if (err) {
                console.log("Something went wrong while connect the DB!!", err)
                return;
            }
            console.log("DB connected successfully!!")
        })
    } catch (error) {
        console.log("Error while connect DB", error)
    }
}

module.exports = {
    connectDB: connectDB,
    DB: DB,
    DB_POOL
}